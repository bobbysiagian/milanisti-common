import EventBus, { EventBusProvider } from './event_bus';
import * as zlib from 'zlib';
import * as uuid from 'uuid';
import { objectValueToString } from '../utils/helpers';
import Bluebird = require('bluebird');
import { Context } from '../typings';

export class EventPublisher extends EventBus {

    private compressPayload(data: Record<string, any>): Buffer {
        const stringified = JSON.stringify(data);
        return zlib.gzipSync(stringified);
    }

    private generateAttributes(context?: Context): Record<string, any> {
        return objectValueToString({
            ...{ request_id: uuid.v4() },
            ...context
        });
    }

    public async publish<Payload extends Record<string, any>>(topicName: string, payload: Payload, context?: Context): Promise<void> {
        const instance = EventBus.getInstance();
        const data = this.compressPayload(payload);
        const attributes = this.generateAttributes(context);
        switch (instance.provider) {
        case EventBusProvider.CLOUD_PUBSUB: {
            await instance.pubsub_instance!.topic(topicName).publishMessage({ data, attributes });
            break;
        }
        default:
            throw new Error('provider not implemented');
        }
    }

    public async publishBatch<Payloads extends Array<Record<string, any>>>(topicName: string, payloads: Payloads): Promise<void> {
        const instance = EventBus.getInstance();
        const attributes = this.generateAttributes();
        const options = { batching: { maxMessages: payloads.length } };
        const compressedPayloads = payloads.map(this.compressPayload);
        switch (instance.provider) {
        case EventBusProvider.CLOUD_PUBSUB: {
            await Bluebird.map(compressedPayloads, (data) =>
                instance.pubsub_instance!.topic(topicName, options).publishMessage({ data, attributes }), { concurrency: payloads.length });
            break;
        }
        default:
            throw new Error('provider not implemented');
        }
    }

}

export default EventPublisher;
