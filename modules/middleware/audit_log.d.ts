import { NextFunction, Request, Response } from 'express';
import { Context } from '../typings';
export interface AuditLogPayload {
    service: string;
    context: Context;
    method: string;
    path: string;
    headers: string;
    query: string;
    params: string;
    body: string;
    is_contain_files: boolean;
    status_code: number;
    message: string;
    start_time: Date;
    finish_time: Date;
}
export declare const AuditLogMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default AuditLogMiddleware;
//# sourceMappingURL=audit_log.d.ts.map