import { RequestHandler, Router } from 'express';
import * as Joi from 'joi';
import FlagService from '../service/flag_service';
import { HandlerMethod, ResponseData } from '../typings/common';
import Logger from '../utils/logger';
type AllowedMethod = 'get' | 'post' | 'put' | 'delete';
type MiddleWare = RequestHandler | RequestHandler[];
export interface StaticBaseController {
    new (...param: any): Controller;
}
interface ControllerOptions {
    path: string;
    middleware?: MiddleWare;
    version?: number;
}
interface RouteOptions {
    middlewares?: MiddleWare;
    validate?: Joi.ObjectSchema;
    allowedRoles?: string[];
    version?: number;
}
export interface RequestMeta {
    body?: Record<string, any>;
    query?: Record<string, any>[];
    headers?: Record<string, any>[];
    files?: Record<string, any>;
}
export interface RouteMeta {
    httpMethod: string;
    path: string;
    methodName: string;
    controller?: string;
    requestMeta?: RequestMeta;
}
export declare abstract class Controller extends Logger {
    private _routes;
    private _middlewares;
    private _path;
    private _version;
    private _routes_meta;
    private _flag;
    constructor({ path, middleware, version }: ControllerOptions);
    protected setMiddleware(middleware: MiddleWare): void;
    protected addRoute<DataOutput extends ResponseData = any>(httpMethod: AllowedMethod, path: string, handler: HandlerMethod<DataOutput>, options?: RouteOptions): void;
    protected abstract setRoutes(): void;
    get routes(): Router;
    get path(): string;
    get routes_meta(): RouteMeta[];
    get flag(): FlagService;
    private getVersionedPath;
}
export default Controller;
//# sourceMappingURL=controller.d.ts.map