import { StatusCodes as StatusCode } from 'http-status-codes';
import { IObject } from '../typings';

interface ICustomError {
    message: string;
    name: string;
    http_status: number;
    code?: string;
    data?: IObject;
}

export class HttpError extends Error {
    public message: string;
    public httpStatus: number;
    public name: string;
    public code: string;
    public data: any;

    constructor({ message, name, http_status, data, code }: ICustomError) {
        super(message);
        this.message = message;
        this.httpStatus = http_status;
        this.name = name;
        this.code = code ? code : String(http_status);
        this.data = data ? data : undefined;
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'BadRequest', http_status: StatusCode.BAD_REQUEST, message, code, data });
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'Unauthorized', http_status: StatusCode.UNAUTHORIZED, message, code, data });
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'Forbidden', http_status: StatusCode.FORBIDDEN, message, code, data });
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'NotFound', http_status: StatusCode.NOT_FOUND, message, code, data });
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'UnprocessableEntity', http_status: StatusCode.UNPROCESSABLE_ENTITY, message, code, data });
    }
}

export class TooManyRequestsError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'TooManyRequests', http_status: StatusCode.TOO_MANY_REQUESTS, message, code, data });
    }
}

export class InternalServerError extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'InternalServerError', http_status: StatusCode.INTERNAL_SERVER_ERROR, message, code, data });
    }
}

export class ServiceUnavailable extends HttpError {
    constructor(message: string, code?: string, data?: IObject) {
        super({ name: 'ServiceUnavailable', http_status: StatusCode.SERVICE_UNAVAILABLE, message, code, data });
    }
}

export default {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    UnprocessableEntityError,
    TooManyRequestsError,
    InternalServerError
};
