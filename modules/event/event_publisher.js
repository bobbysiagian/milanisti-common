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
exports.EventPublisher = void 0;
const event_bus_1 = require("./event_bus");
const zlib = require("zlib");
const uuid = require("uuid");
const helpers_1 = require("../utils/helpers");
const Bluebird = require("bluebird");
class EventPublisher extends event_bus_1.default {
    compressPayload(data) {
        const stringified = JSON.stringify(data);
        return zlib.gzipSync(stringified);
    }
    generateAttributes(context) {
        return (0, helpers_1.objectValueToString)(Object.assign({ request_id: uuid.v4() }, context));
    }
    publish(topicName, payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = event_bus_1.default.getInstance();
            const data = this.compressPayload(payload);
            const attributes = this.generateAttributes(context);
            switch (instance.provider) {
                case event_bus_1.EventBusProvider.CLOUD_PUBSUB: {
                    yield instance.pubsub_instance.topic(topicName).publishMessage({ data, attributes });
                    break;
                }
                default:
                    throw new Error('provider not implemented');
            }
        });
    }
    publishBatch(topicName, payloads) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = event_bus_1.default.getInstance();
            const attributes = this.generateAttributes();
            const options = { batching: { maxMessages: payloads.length } };
            const compressedPayloads = payloads.map(this.compressPayload);
            switch (instance.provider) {
                case event_bus_1.EventBusProvider.CLOUD_PUBSUB: {
                    yield Bluebird.map(compressedPayloads, (data) => instance.pubsub_instance.topic(topicName, options).publishMessage({ data, attributes }), { concurrency: payloads.length });
                    break;
                }
                default:
                    throw new Error('provider not implemented');
            }
        });
    }
}
exports.EventPublisher = EventPublisher;
exports.default = EventPublisher;
