"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const factory_1 = require("../factory");
const helpers_1 = require("../utils/helpers");
const getDataFromRequest = (req) => ({
    query: req.query,
    params: req.params,
    body: req.body
});
const GlobalExceptionHandler = (error, req, res, _next) => {
    var _a;
    const { message, httpStatus = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, name, data, code } = error;
    const logger = factory_1.createLogerInstance({ source: constant_1.LOG_SOURCE.GLOBAL });
    if (error && error.stack) {
        if (helpers_1.isServerError(httpStatus)) {
            logger.error(message, { error, data: getDataFromRequest(req), context: req.context });
        }
        else {
            logger.warn('%s: %s', name, message);
        }
    }
    const response = {
        error_name: httpStatus === http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR ? constant_1.COMMON_ERRORS.SERVER_ERROR : name,
        error_message: message,
        error_code: code || httpStatus,
        error_data: data
    };
    return res.status(httpStatus)
        .set(constant_1.MANDATORY_REQUEST_HEADER.REQUEST_ID, ((_a = req.context) === null || _a === void 0 ? void 0 : _a.request_id) || '')
        .json(response);
};
exports.GlobalExceptionHandler = GlobalExceptionHandler;
exports.default = exports.GlobalExceptionHandler;
