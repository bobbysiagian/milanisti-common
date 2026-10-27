"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.SYSPAR = exports.HttpMethod = exports.SWAGGER_DEFAULT = exports.DEFAULT = exports.ENDPOINTS = exports.MANDATORY_REQUEST_HEADER = exports.LOG_SOURCE = exports.TOKEN_TYPE = exports.CLEARANCE = exports.COMMON_ERRORS = void 0;
var COMMON_ERRORS;
(function (COMMON_ERRORS) {
    COMMON_ERRORS["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    COMMON_ERRORS["SERVER_ERROR"] = "SERVER_ERROR";
    COMMON_ERRORS["TOKEN_INVALID"] = "TOKEN_INVALID";
    COMMON_ERRORS["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    COMMON_ERRORS["ROUTE_NOT_FOUND"] = "ROUTE_NOT_FOUND";
    COMMON_ERRORS["NO_ACCESS"] = "NO_ACCESS";
    COMMON_ERRORS["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
})(COMMON_ERRORS || (exports.COMMON_ERRORS = COMMON_ERRORS = {}));
var CLEARANCE;
(function (CLEARANCE) {
    CLEARANCE[CLEARANCE["BLOCKED"] = 0] = "BLOCKED";
    CLEARANCE[CLEARANCE["AUTHENTICATED"] = 1] = "AUTHENTICATED";
})(CLEARANCE || (exports.CLEARANCE = CLEARANCE = {}));
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE["BEARER"] = "Bearer";
    TOKEN_TYPE["BASIC"] = "Basic";
})(TOKEN_TYPE || (exports.TOKEN_TYPE = TOKEN_TYPE = {}));
var LOG_SOURCE;
(function (LOG_SOURCE) {
    LOG_SOURCE["CONTROLLER"] = "controller";
    LOG_SOURCE["EVENT_SUBSCRIBER"] = "event-subscriber";
    LOG_SOURCE["OUTBOUND_SERVICE"] = "outbound-service";
    LOG_SOURCE["SERVICE"] = "service";
    LOG_SOURCE["GLOBAL"] = "global";
    LOG_SOURCE["MIDDLEWARE"] = "middleware";
})(LOG_SOURCE || (exports.LOG_SOURCE = LOG_SOURCE = {}));
exports.MANDATORY_REQUEST_HEADER = {
    REQUEST_ID: 'x-request-id',
    USER_NAME: 'x-user-name',
    USER_EMAIL: 'x-user-email',
    USER_ID: 'x-user-id',
    ROLE_ID: 'x-role-id',
};
exports.ENDPOINTS = {
    HEALTHCHECK: '/healthcheck',
    SWAGGER_SPEC: '/specs',
    SWAGGER_DOCS: '/api-docs'
};
exports.DEFAULT = {
    REQUEST_SIZE: '1mb',
    SUBS_TEST_CONTROLLER: 'SubscribersController',
    SERVICE_NAME: 'Milanisti Service',
    SERVICE_DESC: 'milanisti backend microservice',
    SERVICE_VERSION: '1.0.0',
    HEALTHCHECK_MESSAGE: 'ahsiapp'
};
exports.SWAGGER_DEFAULT = {
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
    OPTIONS: { url: exports.ENDPOINTS.SWAGGER_SPEC, docExpansion: 'none' }
};
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["POST"] = "POST";
    HttpMethod["GET"] = "GET";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
exports.SYSPAR = {
    MODEL_PATH: '../database/models',
    MODEL_NAME: 'SystemParameter.js'
};
exports.CONFIG = {
    PATH: '../../../../src/config',
    ENV: 'environment.json'
};
