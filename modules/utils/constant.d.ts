export declare enum COMMON_ERRORS {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    TOKEN_INVALID = "TOKEN_INVALID",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND",
    NO_ACCESS = "NO_ACCESS",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
}
export declare enum CLEARANCE {
    BLOCKED = 0,
    AUTHENTICATED = 1
}
export declare enum TOKEN_TYPE {
    BEARER = "Bearer",
    BASIC = "Basic"
}
export declare enum LOG_SOURCE {
    CONTROLLER = "controller",
    EVENT_SUBSCRIBER = "event-subscriber",
    OUTBOUND_SERVICE = "outbound-service",
    SERVICE = "service",
    GLOBAL = "global",
    MIDDLEWARE = "middleware"
}
export declare const MANDATORY_REQUEST_HEADER: {
    REQUEST_ID: string;
    USER_NAME: string;
    USER_EMAIL: string;
    USER_ID: string;
    ROLE_ID: string;
};
export declare const ENDPOINTS: {
    HEALTHCHECK: string;
    SWAGGER_SPEC: string;
    SWAGGER_DOCS: string;
};
export declare const DEFAULT: {
    REQUEST_SIZE: string;
    SUBS_TEST_CONTROLLER: string;
    SERVICE_NAME: string;
    SERVICE_DESC: string;
    SERVICE_VERSION: string;
    HEALTHCHECK_MESSAGE: string;
};
export declare const SWAGGER_DEFAULT: {
    VERSION: string;
    REQUEST_BODY: {
        type: string;
        properties: {
            key: {
                type: string;
            };
        };
    };
    SECURITY_SCHEME: {
        JWTAuth: {
            type: string;
            scheme: string;
        };
        StaticAuth: {
            type: string;
            in: string;
            name: string;
        };
    };
    OPTIONS: {
        url: string;
        docExpansion: string;
    };
};
export declare enum HttpMethod {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE"
}
export declare const SYSPAR: {
    MODEL_PATH: string;
    MODEL_NAME: string;
};
export declare const CONFIG: {
    PATH: string;
    ENV: string;
};
//# sourceMappingURL=constant.d.ts.map