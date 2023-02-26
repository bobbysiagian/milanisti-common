/// <reference types="qs" />
import { RequestHandler } from 'express';
export declare const RateLimiter: (max?: number, retryAfter?: number) => RequestHandler;
declare const _default: {
    RateLimiter: (max?: number, retryAfter?: number) => RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
};
export default _default;
//# sourceMappingURL=rate_limit.d.ts.map