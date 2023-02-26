import { Context } from '../typings';
import Logger from '../utils/logger';
export interface SubscriberMeta {
    topicName: string;
    handlerName: string;
    endpoint: string;
    type: string;
}
export declare enum SubscriberType {
    PULL = "pull",
    PUSH = "push"
}
interface EventSubscriberOptions {
    topic: string;
    type?: SubscriberType;
    maxInProgress?: number;
}
export declare abstract class EventSubscriber<Payload extends Record<string, any> = Record<string, any>> extends Logger {
    private _topicName;
    private _type;
    private _maxInProgress;
    constructor(options: EventSubscriberOptions);
    get topicName(): string;
    get type(): string;
    get path(): string;
    get maxInProgress(): number;
    abstract handler(payload: Payload, context: Context): Promise<void>;
}
export interface StaticEventSubscriber {
    new (...param: any): EventSubscriber;
}
export default EventSubscriber;
//# sourceMappingURL=event_subscriber.d.ts.map