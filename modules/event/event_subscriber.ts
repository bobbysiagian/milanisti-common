import { Context } from '../typings';
import { LOG_SOURCE } from '../utils/constant';
import { camelToSnakeCase } from '../utils/helpers';
import Logger from '../utils/logger';

export interface SubscriberMeta {
    topicName: string;
    handlerName: string;
    endpoint: string;
    type: string;
}

export enum SubscriberType {
    PULL = 'pull',
    PUSH = 'push'
}

interface EventSubscriberOptions {
    topic: string;
    type?: SubscriberType;
    maxInProgress?: number;
}

export abstract class EventSubscriber<Payload extends Record<string, any> = Record<string, any>> extends Logger {
    private _topicName: string;
    private _type: SubscriberType;
    private _maxInProgress: number;

    constructor(options: EventSubscriberOptions) {
        super({
            source: LOG_SOURCE.EVENT_SUBSCRIBER
        });
        this._topicName = options.topic;
        this._type = options.type ?? SubscriberType.PULL;
        this._maxInProgress = options.maxInProgress ?? 10;
    }

    public get topicName(): string {
        return this._topicName;
    }

    public get type(): string {
        return this._type;
    }

    public get path(): string {
        return `/subscribers/${camelToSnakeCase(this.constructor.name, '-')}`;
    }

    public get maxInProgress(): number {
        return this._maxInProgress;
    }

    abstract handler(payload: Payload, context: Context): Promise<void>
}

export interface StaticEventSubscriber {
    new(...param: any): EventSubscriber;
}

export default EventSubscriber;
