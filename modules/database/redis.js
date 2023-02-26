"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const Redis = require("ioredis");
class RedisModule {
    static initialize({ connection_string, password }) {
        if (!this.instance) {
            this.instance = new Redis(connection_string, { password });
        }
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance;
    }
}
exports.RedisModule = RedisModule;
exports.default = RedisModule;
