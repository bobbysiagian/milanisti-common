import { Logger as WinstonLogger } from 'winston';
import { LOG_SOURCE } from '../utils/constant';
export interface LoggerOptions {
    source?: LOG_SOURCE;
}
export declare const createLogerInstance: (options?: LoggerOptions) => WinstonLogger;
export default createLogerInstance;
//# sourceMappingURL=logger_factory.d.ts.map