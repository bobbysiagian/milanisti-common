import { Logger as WinstonLogger } from 'winston';
import { LoggerOptions } from '../factory';
export declare class Logger {
    protected _logger: WinstonLogger;
    constructor(options?: LoggerOptions);
    get logger(): WinstonLogger;
}
export default Logger;
//# sourceMappingURL=logger.d.ts.map