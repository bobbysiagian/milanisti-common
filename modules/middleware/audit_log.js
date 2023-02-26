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
exports.AuditLogMiddleware = void 0;
const uuid = require("uuid");
const event_1 = require("../event");
const constant_1 = require("../utils/constant");
const logger_1 = require("../utils/logger");
const TOPIC_AUDIT_LOG = 'audit-log';
const SECRET_DATA = ['password'];
const AuditLogMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const startTime = new Date();
    res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () { return handleAuditlogEnd(startTime, req, res); }));
    const context = Object.assign(Object.assign({}, req.context), { request_id: ((_a = req.context) === null || _a === void 0 ? void 0 : _a.request_id) || uuid.v4() });
    req.context = context;
    return next();
});
exports.AuditLogMiddleware = AuditLogMiddleware;
const maskSecretData = (body) => {
    const data = Object.assign({}, body);
    Object.keys(data).forEach(key => {
        if (SECRET_DATA.includes(key)) {
            data[key] = '***';
        }
    });
    return JSON.stringify(data);
};
const handleAuditlogEnd = (startTime, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const finishTime = new Date();
        const { context, method, path, query, params, body, headers, files, } = req;
        const { statusCode, statusMessage, } = res;
        const payload = {
            service: process.env.SERVICE_NAME || '',
            context,
            method,
            path,
            headers: JSON.stringify(headers),
            query: JSON.stringify(query),
            params: JSON.stringify(params),
            body: maskSecretData(body),
            is_contain_files: !!files,
            status_code: statusCode,
            message: statusMessage,
            start_time: startTime,
            finish_time: finishTime,
        };
        yield new event_1.EventPublisher()
            .publish(TOPIC_AUDIT_LOG, payload, context);
    }
    catch (error) {
        new logger_1.default({ source: constant_1.LOG_SOURCE.MIDDLEWARE })
            .logger.error('fail publishing audit log', { error });
    }
});
exports.default = exports.AuditLogMiddleware;
