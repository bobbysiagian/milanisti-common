"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriber = exports.SubscriberType = void 0;
const constant_1 = require("../utils/constant");
const helpers_1 = require("../utils/helpers");
const logger_1 = require("../utils/logger");
var SubscriberType;
(function (SubscriberType) {
    SubscriberType["PULL"] = "pull";
    SubscriberType["PUSH"] = "push";
})(SubscriberType = exports.SubscriberType || (exports.SubscriberType = {}));
class EventSubscriber extends logger_1.default {
    constructor(options) {
        var _a, _b;
        super({
            source: constant_1.LOG_SOURCE.EVENT_SUBSCRIBER
        });
        this._topicName = options.topic;
        this._type = (_a = options.type) !== null && _a !== void 0 ? _a : SubscriberType.PULL;
        this._maxInProgress = (_b = options.maxInProgress) !== null && _b !== void 0 ? _b : 10;
    }
    get topicName() {
        return this._topicName;
    }
    get type() {
        return this._type;
    }
    get path() {
        return `/subscribers/${helpers_1.camelToSnakeCase(this.constructor.name, '-')}`;
    }
    get maxInProgress() {
        return this._maxInProgress;
    }
}
exports.EventSubscriber = EventSubscriber;
exports.default = EventSubscriber;
