"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAuth = void 0;
const http_error_1 = require("../utils/http_error");
const constant_1 = require("../utils/constant");
const StaticAuth = ({ headerName, headerValue }) => (req, _res, next) => {
    const header = (headerName || 'secret').toLowerCase();
    const value = headerValue;
    if (req.query[header] === value || req.headers[header] === value) {
        return next();
    }
    return next(new http_error_1.UnauthorizedError('token invalid', constant_1.COMMON_ERRORS.TOKEN_INVALID));
};
exports.StaticAuth = StaticAuth;
exports.default = exports.StaticAuth;
