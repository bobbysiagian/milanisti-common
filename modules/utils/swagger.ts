import Joi = require('joi');
import { RequestMeta } from '../controller';
import { SWAGGER_DEFAULT } from './constant';

const buildExampleValue = (value: string) => {
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

const convertJoiSchemaToSwagger = (joiObject: any) => {
    if (!joiObject._ids._byKey.values().next().value) {
        return {
            type: joiObject.type,
            example: buildExampleValue(joiObject.type)
        };
    }

    const payload: { key: string; value: any }[] = [];
    joiObject._ids._byKey.forEach((value: any, key: string) => {
        payload.push({ key, value: value.schema.type });
    });

    return payload.reduce<Record<any, any>>((acc, item) => {
        if (!acc.properties) { acc.properties = {}; }
        switch (item.value) {
        case 'object':
            acc.properties[item.key] = convertJoiSchemaToSwagger(joiObject._ids._byKey.get(item.key).schema);
            acc.properties[item.key].type = 'object';
            break;
        case 'array':
            acc.properties[item.key] = {
                type: 'array',
                items: { type: 'object', ...convertJoiSchemaToSwagger(joiObject._ids._byKey.get(item.key).schema['$_terms'].items[0]) }
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

const convertSwaggerEntityToParameter = (object: any, type: 'query' | 'path' | 'header'): any => {
    if (!object || !object.properties) {
        return [];
    }
    return Object.keys(object.properties).map(key => {
        const item = object.properties[key];
        return { name: key, in: type, required: false, schema: item };
    });
};

const convertSwaggerEntityToMultipart = (body: any, files: any[]): any => {
    if (!files) {
        return null;
    }
    return {
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                },
                ...(body && body.properties || {})
            }
        }
    };
};

const convertSwaggerEntityToBody = (body: any, files: any): any => {
    if (files) {
        return null;
    }
    return body || SWAGGER_DEFAULT.REQUEST_BODY;
};

export const ConvertJoiSchemaToRequestMeta = (object: Joi.ObjectSchema): RequestMeta => {
    try {
        const { properties: metadata } = convertJoiSchemaToSwagger(object);
        return {
            query: convertSwaggerEntityToParameter(metadata.query, 'query'),
            headers: convertSwaggerEntityToParameter(metadata.headers, 'header'),
            body: convertSwaggerEntityToBody(metadata.body, metadata.files),
            files: convertSwaggerEntityToMultipart(metadata.body, metadata.files)
        };
    } catch (error) {
        console.log(error);
        return {
            body: SWAGGER_DEFAULT.REQUEST_BODY,
            query: [],
            headers: [],
            files: {}
        };
    }
};

export default ConvertJoiSchemaToRequestMeta;
