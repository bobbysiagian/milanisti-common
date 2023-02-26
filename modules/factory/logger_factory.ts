import { createLogger, transports, format, Logger as WinstonLogger, transport } from 'winston';
import { DEFAULT, LOG_SOURCE } from '../utils/constant';
import { isTestEnvironment, titleCase } from '../utils/helpers';

export interface LoggerOptions {
    source?: LOG_SOURCE;
}

const consoleTransportFormat = format.printf((info) => {
    const { level, message } = info;
    if (level === 'error') {
        const errorStack = info.stack || info.error && info.error.stack;
        const meta = [
            info.context ? `\nRequestId: ${info.context.request_id}` : '',
            errorStack ? '\n' + errorStack : '',
            '\n'
        ].filter(item => item);
        return `[${info.service}::${info.source}] \n${titleCase(level)}: ${message} ${meta.join(' ')}`;
    }
    return `${titleCase(level)}: ${message}`;
});

/**
 * @description
 * here we'll register new log transport such as
 * file, scalyr, new relic, etc
 */
const generateLogTransports = (): transport[] => {
    return [new transports.Console({
        format: format.combine(
            format.splat(),
            format.errors({ stack: true }),
            consoleTransportFormat,
            format.colorize({ all: true })
        ),
        silent: isTestEnvironment()
    })];
};

export const createLogerInstance = (options: LoggerOptions = {}): WinstonLogger => {
    return createLogger({
        defaultMeta: {
            source: options.source || LOG_SOURCE.GLOBAL,
            service: process.env.SERVICE_NAME || DEFAULT.SERVICE_NAME
        },
        transports: generateLogTransports()
    });
};

export default createLogerInstance;
