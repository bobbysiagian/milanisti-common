"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertJoiSchemaToRequestMeta = void 0;
const constant_1 = require("./constant");
const buildExampleValue = (value) => {
    switch (value) {
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'date':
            return '1973-01-01';
        case 'object':
            return {};
        default:
            return 'string';
    }
};
const convertJoiSchemaToSwagger = (joiObject) => {
    if (!joiObject._ids._byKey.values().next().value) {
        return {
            type: joiObject.type,
            example: buildExampleValue(joiObject.type)
        };
    }
    const payload = [];
    joiObject._ids._byKey.forEach((value, key) => {
        payload.push({ key, value: value.schema.type });
    });
    return payload.reduce((acc, item) => {
        if (!acc.properties) {
            acc.properties = {};
        }
        switch (item.value) {
            case 'object':
                acc.properties[item.key] = convertJoiSchemaToSwagger(joiObject._ids._byKey.get(item.key).schema);
                acc.properties[item.key].type = 'object';
                break;
            case 'array':
                acc.properties[item.key] = {
                    type: 'array',
                    items: Object.assign({ type: 'object' }, convertJoiSchemaToSwagger(joiObject._ids._byKey.get(item.key).schema['$_terms'].items[0]))
                };
                break;
            default:
                acc.properties[item.key] = {
                    type: item.value,
                    example: buildExampleValue(item.value)
                };
                break;
        }
        return acc;
    }, {});
};
const convertSwaggerEntityToParameter = (object, type) => {
    if (!object || !object.properties) {
        return [];
    }
    return Object.keys(object.properties).map(key => {
        const item = object.properties[key];
        return { name: key, in: type, required: false, schema: item };
    });
};
const convertSwaggerEntityToMultipart = (body, files) => {
    if (!files) {
        return null;
    }
    return {
        schema: {
            type: 'object',
            properties: Object.assign({ files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                } }, (body && body.properties || {}))
        }
    };
};
const convertSwaggerEntityToBody = (body, files) => {
    if (files) {
        return null;
    }
    return body || constant_1.SWAGGER_DEFAULT.REQUEST_BODY;
};
const ConvertJoiSchemaToRequestMeta = (object) => {
    try {
        const { properties: metadata } = convertJoiSchemaToSwagger(object);
        return {
            query: convertSwaggerEntityToParameter(metadata.query, 'query'),
            headers: convertSwaggerEntityToParameter(metadata.headers, 'header'),
            body: convertSwaggerEntityToBody(metadata.body, metadata.files),
            files: convertSwaggerEntityToMultipart(metadata.body, metadata.files)
        };
    }
    catch (error) {
        console.log(error);
        return {
            body: constant_1.SWAGGER_DEFAULT.REQUEST_BODY,
            query: [],
            headers: [],
            files: {}
        };
    }
};
exports.ConvertJoiSchemaToRequestMeta = ConvertJoiSchemaToRequestMeta;
exports.default = exports.ConvertJoiSchemaToRequestMeta;
