import * as express from 'express';
import Controller, { StaticBaseController } from '../controller/controller';
import { EventSubscriber, StaticEventSubscriber } from '../event';
import Logger from '../utils/logger';
export interface ServerConfig {
    port: number;
    syspar?: boolean;
    useAuditLog?: boolean;
    requestSizeLimit?: string;
}
export declare abstract class App extends Logger {
    protected _app: express.Application;
    protected _port: number;
    protected _use_audit_log: boolean;
    protected _use_syspar: boolean;
    protected _is_init: boolean;
    protected _limit: string;
    private _routes_meta;
    private _subscribers_meta;
    constructor({ port, syspar, useAuditLog, requestSizeLimit: limit }: ServerConfig);
    initialize(): Promise<void>;
    /** @Overrided */
    protected initProviders(): Promise<void>;
    /** @Overrided */
    protected extendsPlugins(): Promise<void>;
    /** @Overrided */
    protected initControllers(): Promise<void>;
    get app(): express.Application;
    get port(): number;
    addController(controller: StaticBaseController | Controller): void;
    private addSubscriberAsRoute;
    addSubscriber(subs: EventSubscriber | StaticEventSubscriber): void;
    private initPlugins;
    private initExceptionHandlers;
    private initSystemParameter;
    private checkEnvironmentVariables;
    getInstance(): Express.Application;
    start(): this;
}
export default App;
//# sourceMappingURL=app.d.ts.map