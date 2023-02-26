"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSwaggerSpec = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const helpers_1 = require("../utils/helpers");
const generatePathMetadata = (path) => {
    const trimmed = path.replace(/\/+$/, '');
    const splited = trimmed.split('/').slice(1);
    const reduced = splited.reduce((acc, item) => {
        const isParams = item.includes(':');
        let element = item;
        if (isParams) {
            element = item.replace(':', '');
            acc.parameters.push({ name: element, in: 'path', required: true, schema: { type: 'string' } });
            acc.path.push(`{${element}}`);
        }
        else {
            acc.path.push(element);
        }
        return acc;
    }, { path: [], parameters: [] });
    return {
        parameters: reduced.parameters,
        path: `/${reduced.path.join('/')}`
    };
};
const generateTagItem = (controller) => {
    const separated = controller
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) { return str.toUpperCase(); })
        .trim();
    const splited = separated.split(' ');
    const lastIsController = splited[splited.length - 1].toLowerCase() === 'controller';
    if (lastIsController) {
        splited.pop();
    }
    return splited.join(' ');
};
const generateTag = (routes) => {
    const reduced = routes.reduce((acc, item) => {
        if (item.controller && !acc[item.controller]) {
            acc[item.controller] = generateTagItem(item.controller);
        }
        return acc;
    }, {});
    return Object.keys(reduced).map(key => ({
        name: reduced[key],
        description: key
    }));
};
const mapAuthenticationToSecurity = (auth) => {
    switch (auth) {
        case 'jwt':
            return { JWTAuth: [] };
        case 'static':
            return { StaticAuth: [] };
        default:
            return { JWTAuth: [], StaticAuth: [] };
    }
};
const generateSecurity = (authentication = ['jwt', 'static']) => {
    return authentication.map(mapAuthenticationToSecurity);
};
const generateDefaultResponses = () => {
    return {
        [http_status_codes_1.StatusCodes.OK]: {
            description: 'OK'
        }
    };
};
const getBody = (body, files) => {
    const requestBody = {
        description: 'Request Body',
        required: false,
        content: {}
    };
    if (files) {
        requestBody.content['multipart/form-data'] = files;
    }
    else {
        requestBody.content['application/json'] = {
            schema: body || constant_1.SWAGGER_DEFAULT.REQUEST_BODY
        };
    }
    return requestBody;
};
const generatePath = (paths) => {
    return paths.reduce((acc, item) => {
        var _a, _b, _c, _d;
        const routePath = item.path.replace(/\/+$/, '');
        const httpMethod = item.httpMethod.toLocaleLowerCase();
        const { path, parameters } = generatePathMetadata(routePath);
        if (!(path in acc)) {
            acc[path] = {};
        }
        acc[path][httpMethod] = {
            summary: item.methodName,
            operationId: item.methodName,
            tags: [generateTagItem(item.controller)],
            parameters: [...parameters, ...(((_a = item.requestMeta) === null || _a === void 0 ? void 0 : _a.query) || []), ...(((_b = item.requestMeta) === null || _b === void 0 ? void 0 : _b.headers) || [])],
            security: generateSecurity(),
            responses: generateDefaultResponses(),
            requestBody: httpMethod !== 'get' && getBody((_c = item.requestMeta) === null || _c === void 0 ? void 0 : _c.body, (_d = item.requestMeta) === null || _d === void 0 ? void 0 : _d.files)
        };
        return acc;
    }, {});
};
const generateDefaultPaths = () => {
    return {
        [constant_1.ENDPOINTS.HEALTHCHECK]: {
            get: {
                summary: 'check whether server is up',
                operationId: 'healthcheck',
                tags: ['Default'],
                responses: generateDefaultResponses()
            }
        }
    };
};
const generateName = (serviceName) => {
    return serviceName ? serviceName.split('-').map(helpers_1.titleCase).join(' ') : constant_1.DEFAULT.SERVICE_NAME;
};
const generateSwaggerSpec = (hostName, routes) => {
    const serviceName = generateName(process.env.SERVICE_NAME || process.env.npm_package_name);
    return {
        openapi: constant_1.SWAGGER_DEFAULT.VERSION,
        info: {
            title: serviceName,
            version: process.env.npm_package_version || constant_1.DEFAULT.SERVICE_VERSION,
            description: process.env.npm_package_description || constant_1.DEFAULT.SERVICE_DESC
        },
        servers: [{ 'url': `http://${hostName}` }, { 'url': `https://${hostName}` }],
        tags: generateTag(routes),
        paths: Object.assign(Object.assign({}, generatePath(routes)), generateDefaultPaths()),
        components: {
            securitySchemes: constant_1.SWAGGER_DEFAULT.SECURITY_SCHEME
        }
    };
};
exports.generateSwaggerSpec = generateSwaggerSpec;
exports.default = exports.generateSwaggerSpec;
