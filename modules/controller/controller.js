"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_1 = require("express");
const handler_factory_1 = require("../factory/handler_factory");
const request_validator_1 = require("../middleware/request_validator");
const roles_validator_1 = require("../middleware/roles_validator");
const flag_service_1 = require("../service/flag_service");
const constant_1 = require("../utils/constant");
const logger_1 = require("../utils/logger");
const swagger_1 = require("../utils/swagger");
class Controller extends logger_1.default {
    constructor({ path, middleware, version }) {
        super({ source: constant_1.LOG_SOURCE.CONTROLLER });
        this._middlewares = [];
        this._path = path;
        this._version = version || 1;
        this._routes_meta = [];
        this._flag = new flag_service_1.default();
        if (middleware) {
            this.setMiddleware(middleware);
        }
        this._routes = (0, express_1.Router)({ mergeParams: true });
        this.setRoutes();
    }
    setMiddleware(middleware) {
        if (middleware instanceof Array) {
            this._middlewares = middleware;
        }
        else {
            this._middlewares.push(middleware);
        }
    }
    addRoute(httpMethod, path, handler, options) {
        let middlewares = [];
        if (options === null || options === void 0 ? void 0 : options.middlewares) {
            middlewares = options.middlewares instanceof Array ? options.middlewares : [options.middlewares];
        }
        if (options === null || options === void 0 ? void 0 : options.allowedRoles) {
            middlewares.push((0, roles_validator_1.default)(options === null || options === void 0 ? void 0 : options.allowedRoles));
        }
        if (options === null || options === void 0 ? void 0 : options.validate) {
            middlewares.push((0, request_validator_1.default)(options.validate));
        }
        const pathName = this.getVersionedPath(path, options === null || options === void 0 ? void 0 : options.version);
        const routeMiddleware = middlewares instanceof Array ? middlewares : [middlewares];
        const combinedMiddlewared = [...this._middlewares, ...routeMiddleware];
        this.routes[httpMethod](pathName, combinedMiddlewared, (0, handler_factory_1.default)(handler));
        this._routes_meta.push({
            httpMethod: httpMethod.toUpperCase(),
            path: pathName,
            methodName: handler.name.split(' ')[1],
            requestMeta: (options === null || options === void 0 ? void 0 : options.validate) && (0, swagger_1.default)(options.validate)
        });
    }
    get routes() {
        return this._routes;
    }
    get path() {
        return this._path;
    }
    get routes_meta() {
        return this._routes_meta;
    }
    get flag() {
        return this._flag;
    }
    getVersionedPath(childPath, pathVersion) {
        return `/v${pathVersion || this._version}${this._path}${childPath}`;
    }
}
exports.Controller = Controller;
exports.default = Controller;
