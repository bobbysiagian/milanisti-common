import { AxiosInstance, Method } from 'axios';
import { IObject } from '../typings';
import Logger from '../utils/logger';
interface OutboundHeader {
    [s: string]: any;
}
export interface OutboudOptions {
    method?: Method;
    headers?: OutboundHeader;
}
export declare abstract class OutboundService extends Logger {
    protected caller: AxiosInstance;
    constructor(url: string);
    private doCall;
    protected call<T>(path: string, data?: IObject, options?: OutboudOptions): Promise<T>;
    protected callAsync(path: string, data?: IObject, options?: OutboudOptions): Promise<void>;
}
export default OutboundService;
//# sourceMappingURL=outbound_service.d.ts.map