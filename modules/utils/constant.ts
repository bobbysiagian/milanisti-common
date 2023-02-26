export enum COMMON_ERRORS {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    NO_ACCESS = 'NO_ACCESS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
}

export enum CLEARANCE {
    BLOCKED = 0,
    AUTHENTICATED = 1
}

export enum TOKEN_TYPE {
    BEARER = 'Bearer',
    BASIC = 'Basic'
}

export enum LOG_SOURCE {
    CONTROLLER = 'controller',
    EVENT_SUBSCRIBER = 'event-subscriber',
    OUTBOUND_SERVICE = 'outbound-service',
    SERVICE = 'service',
    GLOBAL = 'global',
    MIDDLEWARE = 'middleware'
}

export const MANDATORY_REQUEST_HEADER = {
    REQUEST_ID: 'x-request-id',
    USER_NAME: 'x-user-name',
    USER_EMAIL: 'x-user-email',
    USER_ID: 'x-user-id',
    ROLE_ID: 'x-role-id',
};

export const ENDPOINTS = {
    HEALTHCHECK: '/healthcheck',
    SWAGGER_SPEC: '/specs',
    SWAGGER_DOCS: '/api-docs'
};

export const DEFAULT = {
    REQUEST_SIZE: '1mb',
    SUBS_TEST_CONTROLLER: 'SubscribersController',
    SERVICE_NAME: 'Milanisti Service',
    SERVICE_DESC: 'milanisti backend microservice',
    SERVICE_VERSION: '1.0.0',
    HEALTHCHECK_MESSAGE: 'ahsiapp'
};

export const SWAGGER_DEFAULT = {
    VERSION: '3.0.0',
    REQUEST_BODY: {
        type: 'object',
        properties: {
            key: {
                type: 'string'
            }
        }
    },
    SECURITY_SCHEME: {
        JWTAuth: {
            type: 'http',
            scheme: 'bearer'
        },
        StaticAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'secret'
        }
    },
    OPTIONS: { url: ENDPOINTS.SWAGGER_SPEC, docExpansion: 'none' }
};

export enum HttpMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export const SYSPAR = {
    MODEL_PATH: '../database/models',
    MODEL_NAME: 'SystemParameter.js'
};

export const CONFIG = {
    PATH: '../../../../src/config',
    ENV: 'environment.json'
};