/// <reference path="../typings/express.d.ts" />
/// <reference types="multer" />

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestData, HandlerMethod, ResponseData, FileData, Context } from '../typings/common';
import { MANDATORY_REQUEST_HEADER } from '../utils/constant';
import { headersToContext } from '../utils/helpers';

const parseInput = (req: Request): RequestData => ({
    query: req.query,
    params: req.params,
    body: req.body,
    headers: req.headers,
    files: req.files || []
});

const getContext = (req: Request): Context => {
    const context = headersToContext(req.headers);
    req.context = { ...context, ...req.context };
    return req.context;
};

const getContentResponseHeader = (file: FileData): Record<string, string> => {
    const { options } = file;
    return options ? {
        'Content-Type': options.mimeType,
        'Content-Disposition': `attachment;filename="${options.fileName}"`,
        'Content-Length': options.size.toString(),
    } : {};
};

export const HandlerFactory = (method: HandlerMethod<ResponseData>): RequestHandler => async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const data = parseInput(req);
        const context: Context = getContext(req);

        /** make data and context immutable */
        Object.freeze(data);
        Object.freeze(context);

        const outData = await method(data, context);
        res.set(MANDATORY_REQUEST_HEADER.REQUEST_ID, context.request_id);

        if (outData?.file) {
            const { buffer } = outData.file;
            return res.set(getContentResponseHeader(outData.file)).end(buffer, 'binary');
        }

        if (outData?.html) {
            return res.set({ 'Content-Type': 'text/html' }).send(outData.html);
        }

        return res.json(outData).status(outData?.code || StatusCodes.OK);

    } catch (err) {
        return next(err);
    }
};

export default HandlerFactory;
