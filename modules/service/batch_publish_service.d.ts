import { BaseProps, Page } from '../typings';
import Service from './service';
interface BatchOptions {
    per_batch?: number;
    per_batch_wait?: number;
    topic: string;
}
export declare abstract class BatchPublishService<Model extends BaseProps, PublishPayload = any> extends Service {
    private perPage;
    private perBatchWait;
    private topic;
    private cacheService;
    constructor({ per_batch: perPage, per_batch_wait: perBatchWait, topic }: BatchOptions);
    abstract getPaginated(page: number, perPage: number): Promise<Page<Model>>;
    abstract transform(data: Record<any, any>): PublishPayload;
    syncAll(): Promise<void>;
}
export default BatchPublishService;
//# sourceMappingURL=batch_publish_service.d.ts.map