"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const controller_1 = require("../controller");
const controller_2 = require("../controller/controller");
const database_1 = require("../database");
const event_1 = require("../event");
const exception_1 = require("../middleware/exception");
const not_found_1 = require("../middleware/not_found");
const repository_1 = require("../repository");
const service_1 = require("../service");
const system_parameter_service_1 = require("../service/system_parameter_service");
const logger_1 = require("../utils/logger");
const http_status_codes_1 = require("http-status-codes");
const subscriber_route_factory_1 = require("../factory/subscriber_route_factory");
const helpers_1 = require("../utils/helpers");
const swagger_factory_1 = require("../factory/swagger_factory");
const constant_1 = require("../utils/constant");
const audit_log_1 = require("../middleware/audit_log");
const mapper_1 = require("../utils/mapper");
class App extends logger_1.default {
    constructor({ port = 8080, syspar = false, useAuditLog = false, requestSizeLimit: limit = constant_1.DEFAULT.REQUEST_SIZE }) {
        super();
        this._is_init = false;
        this._routes_meta = [];
        this._subscribers_meta = [];
        this._app = express();
        this._port = port;
        this._use_syspar = syspar;
        this._use_audit_log = useAuditLog;
        this._limit = limit;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, helpers_1.isTestEnvironment)()) {
                    yield this.checkEnvironmentVariables();
                    yield this.initProviders();
                }
                yield this.initPlugins();
                if (this._use_syspar) {
                    yield this.initSystemParameter();
                }
                yield this.initControllers();
                yield this.initExceptionHandlers();
                this._is_init = true;
            }
            catch (error) {
                this.logger.error('fail initializing server on port %d', this.port, { error });
                process.exit(1);
            }
        });
    }
    /** @Overrided */
    initProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            /** */
        });
    }
    /** @Overrided */
    extendsPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            /** */
        });
    }
    /** @Overrided */
    initControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            /** */
        });
    }
    get app() {
        return this._app;
    }
    get port() {
        return this._port;
    }
    addController(controller) {
        const ctrl = controller instanceof controller_2.default ? controller : new controller();
        this.app.use('/', ctrl.routes);
        this._routes_meta.push(...ctrl.routes_meta.map(item => (Object.assign(Object.assign({}, item), { controller: ctrl.constructor.name }))));
    }
    addSubscriberAsRoute(subscriber) {
        const handler = (0, subscriber_route_factory_1.default)(subscriber);
        this.app.post(subscriber.path, handler);
        this._routes_meta.push((0, mapper_1.generateSubscriberRouteMeta)(subscriber));
    }
    addSubscriber(subs) {
        if ((0, helpers_1.isTestEnvironment)())
            return;
        const subscriber = subs instanceof event_1.EventSubscriber ? subs : new subs();
        const isPull = subscriber.type === event_1.SubscriberType.PULL;
        if (isPull) {
            event_1.EventBus.addSubscriber(subscriber);
        }
        if (!isPull || (0, helpers_1.isDevEnvironment)()) {
            this.addSubscriberAsRoute(subscriber);
        }
        this._subscribers_meta.push((0, mapper_1.generateSubscriberMeta)(subscriber));
    }
    initPlugins() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(express.json({ limit: this._limit }));
            this.app.use(express.urlencoded({ extended: true, limit: this._limit }));
            this.app.use(helmet());
            this.app.use(cors({ origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',').map(crs => crs.trim())) || '*' }));
            this.app.use(compression());
            if (!(0, helpers_1.isTestEnvironment)() && this._use_audit_log) {
                this.app.use(audit_log_1.AuditLogMiddleware);
            }
            if (!(0, helpers_1.isTestEnvironment)()) {
                this.app.use(morgan('common'));
                this.app.use(constant_1.ENDPOINTS.HEALTHCHECK, (_req, res) => res.status(http_status_codes_1.StatusCodes.OK).json({ message: constant_1.DEFAULT.HEALTHCHECK_MESSAGE }));
            }
            if (!(0, helpers_1.isTestEnvironment)() && process.env.SWAGGER) {
                this.app.get(constant_1.ENDPOINTS.SWAGGER_SPEC, (req, res) => res.json((0, swagger_factory_1.default)(req.headers.host, this._routes_meta)));
                this.app.use(constant_1.ENDPOINTS.SWAGGER_DOCS, swaggerUi.serve, swaggerUi.setup({}, { swaggerOptions: constant_1.SWAGGER_DEFAULT.OPTIONS }));
            }
            if (!(0, helpers_1.isTestEnvironment)())
                yield this.extendsPlugins();
        });
    }
    initExceptionHandlers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(not_found_1.default);
            this.app.use(exception_1.default);
        });
    }
    initSystemParameter() {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.SQLContext.registerModel(path.join(__dirname, constant_1.SYSPAR.MODEL_PATH), constant_1.SYSPAR.MODEL_NAME);
            this.addController(new controller_1.SystemParameterController(new system_parameter_service_1.default(new repository_1.SystemParameterRepository, new service_1.CacheService)));
        });
    }
    checkEnvironmentVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let envs;
            try {
                envs = (yield (_a = path.join(__dirname, `${constant_1.CONFIG.PATH}/${constant_1.CONFIG.ENV}`), Promise.resolve().then(() => require(_a))));
            }
            catch (error) {
                this.logger.warn('environment config not found, skipping check ...');
                envs = [];
            }
            const unsetVars = envs.filter(env => process.env[env] === undefined);
            if (unsetVars.length) {
                this.logger.error('this variable(s) need to be set: \n-> ' + unsetVars.join('\n-> '));
                throw new Error('missing required environment variable(s)');
            }
        });
    }
    getInstance() {
        return this._app;
    }
    start() {
        if (!this._is_init) {
            this.logger.warn('app is not initialized');
            process.exit(1);
        }
        this.app.listen(this.port);
        this._routes_meta.forEach(item => {
            this.logger.info(`${item.httpMethod} - ${item.path}`);
        });
        this.logger.info(`server started on port ${this._port}, serving ${this._routes_meta.length} endpoint(s) and ${this._subscribers_meta.length} subscriber(s)...`);
        return this;
    }
}
exports.App = App;
exports.default = App;
