import * as compression from 'compression';
import * as cors from 'cors';
import * as path from 'path';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as swaggerUi from 'swagger-ui-express';

import { SystemParameterController } from '../controller';
import Controller, { RouteMeta, StaticBaseController } from '../controller/controller';
import { SQLContext } from '../database';
import { EventBus, EventSubscriber, SubscriberType, StaticEventSubscriber, SubscriberMeta } from '../event';
import GlobalExceptionHandler from '../middleware/exception';
import RouteNotFoundExceptionHandler from '../middleware/not_found';
import { SystemParameterRepository } from '../repository';
import { CacheService } from '../service';
import SystemParameterService from '../service/system_parameter_service';
import Logger from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import SubscriberRouteFactory from '../factory/subscriber_route_factory';
import { isDevEnvironment, isTestEnvironment } from '../utils/helpers';
import generateSwaggerSpec from '../factory/swagger_factory';
import { CONFIG, DEFAULT, ENDPOINTS, SWAGGER_DEFAULT, SYSPAR } from '../utils/constant';
import { AuditLogMiddleware } from '../middleware/audit_log';
import { generateSubscriberMeta, generateSubscriberRouteMeta } from '../utils/mapper';

export interface ServerConfig {
    port: number;
    syspar?: boolean;
    useAuditLog?: boolean;
    requestSizeLimit?: string;
}

export abstract class App extends Logger {
    protected _app: express.Application;

    protected _port: number;

    protected _use_audit_log: boolean;
    protected _use_syspar: boolean;
    protected _is_init = false;
    protected _limit: string;

    private _routes_meta: RouteMeta[] = [];
    private _subscribers_meta: SubscriberMeta[] = [];

    public constructor({ port = 8080, syspar = false, useAuditLog = false, requestSizeLimit: limit = DEFAULT.REQUEST_SIZE }: ServerConfig) {
        super();
        this._app = express();
        this._port = port;
        this._use_syspar = syspar;
        this._use_audit_log = useAuditLog;
        this._limit = limit;
    }

    public async initialize(): Promise<void> {
        try {
            if (!isTestEnvironment()) {
                await this.checkEnvironmentVariables();
                await this.initProviders();
            }
            await this.initPlugins();
            if (this._use_syspar){
                await this.initSystemParameter();
            }
            await this.initControllers();
            await this.initExceptionHandlers();
            this._is_init = true;
        } catch (error) {
            this.logger.error('fail initializing server on port %d', this.port, { error });
            process.exit(1);
        }
    }

    /** @Overrided */
    protected async initProviders(): Promise<void> {
        /** */
    }

    /** @Overrided */
    protected async extendsPlugins(): Promise<void> {
        /** */
    }

    /** @Overrided */
    protected async initControllers(): Promise<void> {
        /** */
    }

    public get app(): express.Application {
        return this._app;
    }

    public get port(): number {
        return this._port;
    }

    public addController(controller: StaticBaseController | Controller): void {
        const ctrl: Controller = controller instanceof Controller ? controller : new controller();
        this.app.use('/', ctrl.routes);
        this._routes_meta.push(...ctrl.routes_meta.map(item => ({ ...item, controller: ctrl.constructor.name })));
    }

    private addSubscriberAsRoute(subscriber: EventSubscriber) {
        const handler = SubscriberRouteFactory(subscriber);
        this.app.post(subscriber.path, handler);
        this._routes_meta.push(generateSubscriberRouteMeta(subscriber));
    }

    public addSubscriber(subs: EventSubscriber | StaticEventSubscriber): void {
        if (isTestEnvironment()) return;

        const subscriber: EventSubscriber = subs instanceof EventSubscriber ? subs : new subs();

        const isPull = subscriber.type === SubscriberType.PULL;
        if (isPull) {
            EventBus.addSubscriber(subscriber);
        }
        if (!isPull || isDevEnvironment()) {
            this.addSubscriberAsRoute(subscriber);
        }

        this._subscribers_meta.push(generateSubscriberMeta(subscriber));
    }

    private async initPlugins(): Promise<void> {
        this.app.use(express.json({ limit: this._limit }));
        this.app.use(express.urlencoded({ extended: true, limit: this._limit }));
        this.app.use(helmet());
        this.app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map(crs => crs.trim()) || '*' }));
        this.app.use(compression());

        if (!isTestEnvironment() && this._use_audit_log) {
            this.app.use(AuditLogMiddleware);
        }

        if (!isTestEnvironment()) {
            this.app.use(morgan('common'));
            this.app.use(ENDPOINTS.HEALTHCHECK, (_req, res) => res.status(StatusCodes.OK).json({ message: DEFAULT.HEALTHCHECK_MESSAGE }));
        }

        if (!isTestEnvironment() && process.env.SWAGGER) {
            this.app.get(ENDPOINTS.SWAGGER_SPEC, (req, res) => res.json(generateSwaggerSpec(req.headers.host!, this._routes_meta)));
            this.app.use(ENDPOINTS.SWAGGER_DOCS, swaggerUi.serve, swaggerUi.setup({}, { swaggerOptions: SWAGGER_DEFAULT.OPTIONS }));
        }

        if (!isTestEnvironment())
            await this.extendsPlugins();
    }

    private async initExceptionHandlers(): Promise<void> {
        this.app.use(RouteNotFoundExceptionHandler);
        this.app.use(GlobalExceptionHandler);
    }

    private async initSystemParameter(): Promise<void> {
        SQLContext.registerModel(
            path.join(__dirname, SYSPAR.MODEL_PATH),
            SYSPAR.MODEL_NAME
        );
        this.addController(new SystemParameterController(
            new SystemParameterService(
                new SystemParameterRepository,
                new CacheService
            )
        ));
    }

    private async checkEnvironmentVariables() {
        let envs: string[];
        try {
            envs = await import(path.join(__dirname, `${CONFIG.PATH}/${CONFIG.ENV}`)) as string[];
        } catch (error) {
            this.logger.warn('environment config not found, skipping check ...');
            envs = [];
        }
        const unsetVars = envs.filter(env => process.env[env] === undefined);
        if (unsetVars.length) {
            this.logger.error('this variable(s) need to be set: \n-> ' + unsetVars.join('\n-> '));
            throw new Error('missing required environment variable(s)');
        }
    }

    public getInstance(): Express.Application {
        return this._app;
    }

    public start(): this {
        if (!this._is_init) {
            this.logger.warn('app is not initialized');
            process.exit(1);
        }
        this.app.listen(this.port);
        this._routes_meta.forEach(item => {
            this.logger.info(`${item.httpMethod} - ${item.path}`)
        })
        this.logger.info(`server started on port ${this._port}, serving ${this._routes_meta.length} endpoint(s) and ${this._subscribers_meta.length} subscriber(s)...`);
        return this;
    }
}

export default App;
