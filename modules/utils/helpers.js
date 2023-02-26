"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateDatabaseConfig = exports.isDevEnvironment = exports.isTestEnvironment = exports.titleCase = exports.objectValueToString = exports.headersToContext = exports.contextToHeaders = exports.isServerError = exports.camelToSnakeCase = exports.spitTrim = exports.timestamp = exports.sorter = exports.stringifyObjectKey = exports.trimObjectKey = exports.isEmptyArray = exports.isEmptyObject = exports.offset = exports.parseDataObject = void 0;
const moment = require("moment");
const uuid = require("uuid");
const constant_1 = require("./constant");
const parseDataObject = (object) => JSON.parse(JSON.stringify(object));
exports.parseDataObject = parseDataObject;
const offset = (page = 1, per_page = 10) => (page - 1) * per_page;
exports.offset = offset;
const isEmptyObject = (object) => !Object.keys(object).length;
exports.isEmptyObject = isEmptyObject;
const isEmptyArray = (array) => array.length === 0;
exports.isEmptyArray = isEmptyArray;
const trimObjectKey = (object) => {
    Object.keys(object).forEach((key) => (object[key] === null || object[key] === '' || object[key] === undefined) && delete object[key]);
    return object;
};
exports.trimObjectKey = trimObjectKey;
const stringifyObjectKey = (object) => {
    Object.keys(object).forEach((key) => {
        object[key] = String(object[key]);
    });
    return object;
};
exports.stringifyObjectKey = stringifyObjectKey;
const sorter = (sort = '-created_at') => {
    let sortString = sort;
    let sortMethod;
    if (sortString.charAt(0) === '-') {
        sortMethod = 'DESC';
        sortString = sort.substring(1);
    }
    else {
        sortMethod = 'ASC';
    }
    return [sortString, sortMethod];
};
exports.sorter = sorter;
const timestamp = () => moment().utc().toISOString();
exports.timestamp = timestamp;
const spitTrim = (str, delimiter = ',') => {
    return str.split(delimiter).map(i => i.trim()).filter(i => i);
};
exports.spitTrim = spitTrim;
const camelToSnakeCase = (str, delimiter = '_') => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `${delimiter}${letter.toLowerCase()}`);
exports.camelToSnakeCase = camelToSnakeCase;
const isServerError = (statusCode) => {
    return String(statusCode)[0] === '5';
};
exports.isServerError = isServerError;
const contextToHeaders = (context) => {
    return {
        [constant_1.MANDATORY_REQUEST_HEADER.REQUEST_ID]: context.request_id || '',
        [constant_1.MANDATORY_REQUEST_HEADER.USER_EMAIL]: context.email || '',
        [constant_1.MANDATORY_REQUEST_HEADER.USER_ID]: context.user_id || '',
        [constant_1.MANDATORY_REQUEST_HEADER.USER_NAME]: context.fullname || '',
        [constant_1.MANDATORY_REQUEST_HEADER.ROLE_ID]: context.role_id || '',
    };
};
exports.contextToHeaders = contextToHeaders;
const headersToContext = (headers) => {
    return {
        request_id: headers[constant_1.MANDATORY_REQUEST_HEADER.REQUEST_ID] || uuid.v4(),
        user_id: headers[constant_1.MANDATORY_REQUEST_HEADER.USER_ID] || null,
        email: headers[constant_1.MANDATORY_REQUEST_HEADER.USER_EMAIL] || null,
        fullname: headers[constant_1.MANDATORY_REQUEST_HEADER.USER_NAME] || null,
        role_id: headers[constant_1.MANDATORY_REQUEST_HEADER.ROLE_ID] || null,
    };
};
exports.headersToContext = headersToContext;
const objectValueToString = (data) => {
    const object = Object.assign({}, data);
    return Object.keys(object).reduce((acc, item) => {
        if (object[item]) {
            acc[item] = String(object[item]);
        }
        return acc;
    }, {});
};
exports.objectValueToString = objectValueToString;
const titleCase = (text) => text.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
exports.titleCase = titleCase;
const isTestEnvironment = () => process.env.NODE_ENV === 'test';
exports.isTestEnvironment = isTestEnvironment;
const isDevEnvironment = () => ['local', 'development'].includes(String(process.env.NODE_ENV));
exports.isDevEnvironment = isDevEnvironment;
const generateDatabaseConfig = (env) => {
    const [dialect, temp] = env.split('://');
    const [credential, temp2] = temp.split('@');
    const [username, password = ''] = credential.split(':');
    const [server, database] = temp2.split('/');
    const [host, port] = server.split(':');
    return {
        username,
        password,
        database,
        port,
        host,
        dialect
    };
};
exports.generateDatabaseConfig = generateDatabaseConfig;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
exports.sleep = sleep;
exports.default = {
    timestamp: exports.timestamp,
    parseDataObject: exports.parseDataObject,
    offset: exports.offset,
    isEmptyArray: exports.isEmptyArray,
    isEmptyObject: exports.isEmptyObject,
    trimObjectKey: exports.trimObjectKey,
    stringifyObjectKey: exports.stringifyObjectKey,
    spitTrim: exports.spitTrim,
    camelToSnakeCase: exports.camelToSnakeCase,
    isServerError: exports.isServerError,
    contextToHeaders: exports.contextToHeaders,
    headersToContext: exports.headersToContext,
    objectValueToString: exports.objectValueToString,
    titleCase: exports.titleCase,
    isTestEnvironment: exports.isTestEnvironment,
    sleep: exports.sleep
};
