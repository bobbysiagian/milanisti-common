import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';
import { EventPublisher } from '../event';
import { Context } from '../typings';
import { LOG_SOURCE } from '../utils/constant';
import Logger from '../utils/logger';

export interface AuditLogPayload {
    service: string
    context: Context
    method: string
    path: string
    headers: string
    query: string
    params: string
    body: string
    is_contain_files: boolean
    status_code: number
    message: string
    start_time: Date
    finish_time: Date
}

const TOPIC_AUDIT_LOG = 'audit-log';

const SECRET_DATA = ['password'];

export const AuditLogMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startTime = new Date();
    res.on('finish', async () => handleAuditlogEnd(startTime, req, res));

    const context: Context = {
        ...req.context,
        request_id: req.context?.request_id || uuid.v4(),
    };
    req.context = context;

    return next();
};

const maskSecretData = (body: Record<string, any> | undefined) => {
    const data = { ...body };

    Object.keys(data).forEach(key => {
        if (SECRET_DATA.includes(key)) {
            data[key] = '***';
        }
    });

    return JSON.stringify(data);
};

const handleAuditlogEnd = async (startTime: Date, req: Request, res: Response): Promise<void> => {
    try {
        const finishTime = new Date();

        const {
            context,
            method,
            path,
            query,
            params,
            body,
            headers,
            files,
        } = req;

        const {
            statusCode,
            statusMessage,
        } = res;

        const payload: AuditLogPayload = {
            service: process.env.SERVICE_NAME || '',
            context,
            method,
            path,
            headers: JSON.stringify(headers),
            query: JSON.stringify(query),
            params: JSON.stringify(params),
            body: maskSecretData(body),
            is_contain_files: !!files,
            status_code: statusCode,
            message: statusMessage,
            start_time: startTime,
            finish_time: finishTime,
        };

        await new EventPublisher()
            .publish(TOPIC_AUDIT_LOG, payload, context);

    } catch (error) {
        new Logger({ source: LOG_SOURCE.MIDDLEWARE })
            .logger.error('fail publishing audit log', { error });
    }
};

export default AuditLogMiddleware;
