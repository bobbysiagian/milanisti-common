"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailable = exports.InternalServerError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.HttpError = void 0;
const http_status_codes_1 = require("http-status-codes");
class HttpError extends Error {
    constructor({ message, name, http_status, data, code }) {
        super(message);
        this.message = message;
        this.httpStatus = http_status;
        this.name = name;
        this.code = code ? code : String(http_status);
        this.data = data ? data : undefined;
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'BadRequest', http_status: http_status_codes_1.StatusCodes.BAD_REQUEST, message, code, data });
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'Unauthorized', http_status: http_status_codes_1.StatusCodes.UNAUTHORIZED, message, code, data });
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'Forbidden', http_status: http_status_codes_1.StatusCodes.FORBIDDEN, message, code, data });
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'NotFound', http_status: http_status_codes_1.StatusCodes.NOT_FOUND, message, code, data });
    }
}
exports.NotFoundError = NotFoundError;
class UnprocessableEntityError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'UnprocessableEntity', http_status: http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, message, code, data });
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'TooManyRequests', http_status: http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, message, code, data });
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class InternalServerError extends HttpError {
    constructor(message, code, data) {
        super({ name: 'InternalServerError', http_status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message, code, data });
    }
}
exports.InternalServerError = InternalServerError;
class ServiceUnavailable extends HttpError {
    constructor(message, code, data) {
        super({ name: 'ServiceUnavailable', http_status: http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE, message, code, data });
    }
}
exports.ServiceUnavailable = ServiceUnavailable;
exports.default = {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    UnprocessableEntityError,
    TooManyRequestsError,
    InternalServerError
};
