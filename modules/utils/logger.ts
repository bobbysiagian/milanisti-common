import { Logger as WinstonLogger } from 'winston';
import { createLogerInstance, LoggerOptions } from '../factory';

export class Logger {
    protected _logger: WinstonLogger;

    constructor(options: LoggerOptions = {}) {
        this._logger = createLogerInstance(options);
    }

    get logger(): WinstonLogger {
        return this._logger;
    }
}

export default Logger;