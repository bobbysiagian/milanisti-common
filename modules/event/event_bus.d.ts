import { PubSub } from '@google-cloud/pubsub';
import EventSubscriber from './event_subscriber';
export declare enum EventBusProvider {
    CLOUD_PUBSUB = "cloud-pubsub",
    MQTT = "mqtt",
    SQS = "sqs"
}
export interface EventBusOpts {
    provider?: EventBusProvider;
    connection_string: string;
    group_id: string;
}
interface EventBusInstance {
    group_id: string;
    provider: EventBusProvider;
    pubsub_instance?: PubSub;
}
export declare class EventBus {
    static instance: EventBusInstance;
    static logger: import("winston").Logger;
    static initialize(options: EventBusOpts): void;
    static getInstance(): EventBusInstance;
    private static decompressPayload;
    private static getContextFromAttributes;
    private static getPubsubSubscriptionOptions;
    private static registerPubsubSubscriber;
    static addSubscriber(subscriber: EventSubscriber): void;
}
export default EventBus;
//# sourceMappingURL=event_bus.d.ts.map