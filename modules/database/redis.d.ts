import * as Redis from 'ioredis';
interface IRedisOpts {
    connection_string: string;
    password?: string;
}
export type RedisInstance = Redis.Redis;
export declare class RedisModule {
    private static instance;
    static initialize({ connection_string, password }: IRedisOpts): void;
    static getInstance(): RedisInstance;
}
export default RedisModule;
//# sourceMappingURL=redis.d.ts.map