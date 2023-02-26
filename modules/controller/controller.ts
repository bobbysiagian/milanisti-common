import { RequestHandler, Router } from 'express';
import * as Joi from 'joi';
import HandlerFactory from '../factory/handler_factory';
import request_validator from '../middleware/request_validator';
import roles_validator from '../middleware/roles_validator';
import FlagService from '../service/flag_service';
import { HandlerMethod, ResponseData } from '../typings/common';
import { LOG_SOURCE } from '../utils/constant';
import Logger from '../utils/logger';
import ConvertJoiSchemaToRequestMeta from '../utils/swagger';

type AllowedMethod = 'get' | 'post' | 'put' | 'delete';
type MiddleWare = RequestHandler | RequestHandler[];

export interface StaticBaseController {
    new(...param: any): Controller;
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

export abstract class Controller extends Logger {
    private _routes: Router;
    private _middlewares: RequestHandler[] = [];
    private _path: string;
    private _version: number;

    private _routes_meta: RouteMeta[];

    private _flag: FlagService;

    public constructor({ path, middleware, version }: ControllerOptions) {
        super({ source: LOG_SOURCE.CONTROLLER });
        this._path = path;
        this._version = version || 1;
        this._routes_meta = [];
        this._flag = new FlagService();
        if (middleware) {
            this.setMiddleware(middleware);
        }
        this._routes = Router({ mergeParams: true });
        this.setRoutes();
    }

    protected setMiddleware(middleware: MiddleWare): void {
        if (middleware instanceof Array) {
            this._middlewares = middleware;
        } else {
            this._middlewares.push(middleware);
        }
    }

    protected addRoute<DataOutput extends ResponseData = any>(httpMethod: AllowedMethod, path: string, handler: HandlerMethod<DataOutput>, options?: RouteOptions): void {
        let middlewares: MiddleWare = [];

        if (options?.middlewares) {
            middlewares = options.middlewares instanceof Array ? options.middlewares : [options.middlewares];
        }

        if (options?.allowedRoles) {
            middlewares.push(roles_validator(options?.allowedRoles));
        }

        if (options?.validate) {
            middlewares.push(request_validator(options.validate));
        }

        const pathName = this.getVersionedPath(path, options?.version);
        const routeMiddleware: RequestHandler[] = middlewares instanceof Array ? middlewares : [middlewares];
        const combinedMiddlewared = [...this._middlewares, ...routeMiddleware];

        this.routes[httpMethod](pathName, combinedMiddlewared, HandlerFactory(handler));

        this._routes_meta.push({
            httpMethod: httpMethod.toUpperCase(),
            path: pathName,
            methodName: handler.name.split(' ')[1],
            requestMeta: options?.validate && ConvertJoiSchemaToRequestMeta(options.validate)
        });
    }

    protected abstract setRoutes(): void;

    public get routes(): Router {
        return this._routes;
    }

    public get path(): string {
        return this._path;
    }

    public get routes_meta(): RouteMeta[] {
        return this._routes_meta;
    }

    public get flag(): FlagService {
        return this._flag;
    }

    private getVersionedPath(childPath: string, pathVersion?: number): string {
        return `/v${pathVersion || this._version}${this._path}${childPath}`;
    }
}

export default Controller;
