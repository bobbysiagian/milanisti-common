/// <reference path="../typings/express.d.ts" />
import { RequestHandler } from 'express';
import { HandlerMethod, ResponseData } from '../typings/common';
export declare const HandlerFactory: (method: HandlerMethod<ResponseData>) => RequestHandler;
export default HandlerFactory;
//# sourceMappingURL=handler_factory.d.ts.map