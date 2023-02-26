"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubscriberMeta = exports.generateSubscriberRouteMeta = void 0;
const constant_1 = require("./constant");
const generateSubscriberRouteMeta = (subscriber) => {
    return {
        httpMethod: constant_1.HttpMethod.POST,
        methodName: subscriber.constructor.name,
        path: subscriber.path,
        controller: constant_1.DEFAULT.SUBS_TEST_CONTROLLER
    };
};
exports.generateSubscriberRouteMeta = generateSubscriberRouteMeta;
const generateSubscriberMeta = (subscriber) => {
    return {
        topicName: subscriber.topicName,
        handlerName: subscriber.constructor.name,
        endpoint: subscriber.path,
        type: subscriber.type
    };
};
exports.generateSubscriberMeta = generateSubscriberMeta;
