import EventBus from './event_bus';
import { Context } from '../typings';
export declare class EventPublisher extends EventBus {
    private compressPayload;
    private generateAttributes;
    publish<Payload extends Record<string, any>>(topicName: string, payload: Payload, context?: Context): Promise<void>;
    publishBatch<Payloads extends Array<Record<string, any>>>(topicName: string, payloads: Payloads): Promise<void>;
}
export default EventPublisher;
//# sourceMappingURL=event_publisher.d.ts.map