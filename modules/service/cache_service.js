"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const repository_1 = require("../repository");
class CacheService extends repository_1.RedisRepo {
    constructor() {
        super('CacheService');
    }
}
exports.CacheService = CacheService;
exports.default = CacheService;
