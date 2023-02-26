import { Message, PubSub, SubscriberOptions } from '@google-cloud/pubsub';
import EventSubscriber from './event_subscriber';
import * as zlib from 'zlib';
import { createLogerInstance } from '../factory';
import { LOG_SOURCE } from '../utils/constant';
import { Context } from '../typings';

export enum EventBusProvider {
    CLOUD_PUBSUB = 'cloud-pubsub',
    MQTT = 'mqtt',
    SQS = 'sqs'
}

export interface EventBusOpts {
    provider?: EventBusProvider;
    connection_string: string;
    group_id: string;
}

interface EventBusInstance {
    group_id: string;
    provider: EventBusProvider
    pubsub_instance?: PubSub;
}

export class EventBus {
    static instance: EventBusInstance;

    static logger = createLogerInstance({ source: LOG_SOURCE.GLOBAL });

    static initialize(options: EventBusOpts): void {
        this.instance = {
            provider: options.provider || EventBusProvider.CLOUD_PUBSUB,
            group_id: options.group_id,
        };
        switch (this.instance.provider) {
        case EventBusProvider.CLOUD_PUBSUB:
            this.instance.pubsub_instance = new PubSub({ keyFilename: options.connection_string });
            break;
        default:
            throw new Error('provider not supported yet');
        }
    }

    static getInstance(): EventBusInstance {
        if (!this.instance) {
            throw new Error('event bus not initialize');
        }
        return this.instance;
    }

    private static decompressPayload(payload: Buffer): Record<string, unknown> {
        try {
            const buffer = zlib.unzipSync(payload);
            return JSON.parse(buffer.toString());
        } catch (err) {
            return {};
        }
    }

    private static getContextFromAttributes(attributes: Record<string, any>): Context {
        return {
            user_id: attributes.user_id || null,
            email: attributes.email || null,
            fullname: attributes.fullname || null,
            request_id: attributes.request_id || null,
            role_id: attributes.role_id || null,
        };
    }

    private static getPubsubSubscriptionOptions(groupId: string, subscriber: EventSubscriber): { options: SubscriberOptions, topicName: string } {
        return {
            topicName: `${groupId}-${subscriber.topicName}`,
            options: {
                flowControl: {
                    maxMessages: subscriber.maxInProgress
                }
            }
        };
    }

    private static registerPubsubSubscriber(subscriber: EventSubscriber) {
        const instance = this.getInstance();

        const { topicName, options } = this.getPubsubSubscriptionOptions(instance.group_id, subscriber);
        const subscription = instance.pubsub_instance!.subscription(topicName, options);

        subscription.on('message', async (message: Message) => {
            const payload = this.decompressPayload(message.data);
            const context = this.getContextFromAttributes(message.attributes);
            try {
                await subscriber.handler(payload, context);
                message.ack();
            } catch (error) {
                message.nack();
                this.logger.error('Fail executing %s', topicName, { error, context });
            }
        });

        subscription.on('error', (error) => {
            this.logger.error('Error on %s', topicName, { error });
        });
    }

    static addSubscriber(subscriber: EventSubscriber): void {
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

export default EventBus;
