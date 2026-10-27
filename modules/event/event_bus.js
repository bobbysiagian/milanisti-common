"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = exports.EventBusProvider = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const zlib = require("zlib");
const factory_1 = require("../factory");
const constant_1 = require("../utils/constant");
var EventBusProvider;
(function (EventBusProvider) {
    EventBusProvider["CLOUD_PUBSUB"] = "cloud-pubsub";
    EventBusProvider["MQTT"] = "mqtt";
    EventBusProvider["SQS"] = "sqs";
})(EventBusProvider || (exports.EventBusProvider = EventBusProvider = {}));
class EventBus {
    static initialize(options) {
        this.instance = {
            provider: options.provider || EventBusProvider.CLOUD_PUBSUB,
            group_id: options.group_id,
        };
        switch (this.instance.provider) {
            case EventBusProvider.CLOUD_PUBSUB:
                this.instance.pubsub_instance = new pubsub_1.PubSub({ keyFilename: options.connection_string });
                break;
            default:
                throw new Error('provider not supported yet');
        }
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('event bus not initialize');
        }
        return this.instance;
    }
    static decompressPayload(payload) {
        try {
            const buffer = zlib.unzipSync(payload);
            return JSON.parse(buffer.toString());
        }
        catch (err) {
            return {};
        }
    }
    static getContextFromAttributes(attributes) {
        return {
            user_id: attributes.user_id || null,
            email: attributes.email || null,
            fullname: attributes.fullname || null,
            request_id: attributes.request_id || null,
            role_id: attributes.role_id || null,
        };
    }
    static getPubsubSubscriptionOptions(groupId, subscriber) {
        return {
            topicName: `${groupId}-${subscriber.topicName}`,
            options: {
                flowControl: {
                    maxMessages: subscriber.maxInProgress
                }
            }
        };
    }
    static registerPubsubSubscriber(subscriber) {
        const instance = this.getInstance();
        const { topicName, options } = this.getPubsubSubscriptionOptions(instance.group_id, subscriber);
        const subscription = instance.pubsub_instance.subscription(topicName, options);
        subscription.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
            const payload = this.decompressPayload(message.data);
            const context = this.getContextFromAttributes(message.attributes);
            try {
                yield subscriber.handler(payload, context);
                message.ack();
            }
            catch (error) {
                message.nack();
                this.logger.error('Fail executing %s', topicName, { error, context });
            }
        }));
        subscription.on('error', (error) => {
            this.logger.error('Error on %s', topicName, { error });
        });
    }
    static addSubscriber(subscriber) {
        const instance = this.getInstance();
        switch (instance.provider) {
            case EventBusProvider.CLOUD_PUBSUB: {
                this.registerPubsubSubscriber(subscriber);
                break;
            }
            default:
                throw new Error('provider not supported yet');
        }
    }
}
exports.EventBus = EventBus;
EventBus.logger = (0, factory_1.createLogerInstance)({ source: constant_1.LOG_SOURCE.GLOBAL });
exports.default = EventBus;
