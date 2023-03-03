"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogerInstance = void 0;
const winston_1 = require("winston");
const constant_1 = require("../utils/constant");
const helpers_1 = require("../utils/helpers");
const consoleTransportFormat = winston_1.format.printf((info) => {
    const { level, message } = info;
    if (level === 'error') {
        const errorStack = info.stack || info.error && info.error.stack;
        const meta = [
            info.context ? `\nRequestId: ${info.context.request_id}` : '',
            errorStack ? '\n' + errorStack : '',
            '\n'
        ].filter(item => item);
        return `[${info.service}::${info.source}] \n${(0, helpers_1.titleCase)(level)}: ${message} ${meta.join(' ')}`;
    }
    return `${(0, helpers_1.titleCase)(level)}: ${message}`;
});
/**
 * @description
 * here we'll register new log transport such as
 * file, scalyr, new relic, etc
 */
const generateLogTransports = () => {
    return [new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.splat(), winston_1.format.errors({ stack: true }), consoleTransportFormat, winston_1.format.colorize({ all: true })),
            silent: (0, helpers_1.isTestEnvironment)()
        })];
};
const createLogerInstance = (options = {}) => {
    return (0, winston_1.createLogger)({
        defaultMeta: {
            source: options.source || constant_1.LOG_SOURCE.GLOBAL,
            service: process.env.SERVICE_NAME || constant_1.DEFAULT.SERVICE_NAME
        },
        transports: generateLogTransports()
    });
};
exports.createLogerInstance = createLogerInstance;
exports.default = exports.createLogerInstance;
