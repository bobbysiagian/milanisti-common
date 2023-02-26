import axios, { AxiosInstance, Method } from 'axios';
import { IObject } from '../typings';
import { LOG_SOURCE } from '../utils/constant';
import { InternalServerError } from '../utils/http_error';
import Logger from '../utils/logger';

interface OutboundHeader {
    [s:string]: any;
}

export interface OutboudOptions {
    method?: Method
    headers?: OutboundHeader;
}

export abstract class OutboundService extends Logger {
    protected caller: AxiosInstance;

    constructor(url: string) {
        super({ source: LOG_SOURCE.OUTBOUND_SERVICE });
        this.caller = axios.create({ baseURL: url });
    }

    private async doCall<T>(path: string, data?: IObject, options?: OutboudOptions): Promise<T> {
        const { data: response } = await this.caller({
            method: options?.method || 'post',
            url: path, data,
            headers: options?.headers
        });
        return response;
    }

    protected async call<T>(path: string, data?: IObject, options?: OutboudOptions): Promise<T> {
        try {
            return this.doCall<T>(path, data, options);
        } catch (error: any) {
            this.logger.error(`outboud call to ${path} fail`, error);
            throw new InternalServerError(`outboud call ${path} fail, ${error.message}`, 'OUTBOUND_FAIL');
        }
    }

    protected async callAsync(path: string, data?: IObject, options?: OutboudOptions): Promise<void> {
        setImmediate(async () => {
            try {
                await this.doCall(path, data, options);
            } catch (error: any) {
                this.logger.error(`outboud call to ${path} fail`, error);
            }
        });
    }
}

export default OutboundService;
