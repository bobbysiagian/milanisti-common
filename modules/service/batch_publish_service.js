"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchPublishService = void 0;
const service_1 = require("./service");
const bluebird = require("bluebird");
const utils_1 = require("../utils");
const cache_service_1 = require("./cache_service");
const http_error_1 = require("../utils/http_error");
class BatchPublishService extends service_1.default {
    constructor({ per_batch: perPage, per_batch_wait: perBatchWait, topic }) {
        super();
        this.perPage = perPage || 50;
        this.perBatchWait = perBatchWait || 0;
        this.topic = topic;
        this.cacheService = new cache_service_1.default();
    }
    syncAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `ONGOING-${BatchPublishService.name.toLocaleUpperCase()}`;
            const hasOngoingProcess = yield this.cacheService.get(cacheKey);
            if (hasOngoingProcess) {
                throw new http_error_1.BadRequestError('ongoing sync process', 'ONGOING_SYNC_PROCESS');
            }
            yield this.cacheService.set(cacheKey, { has_ongoing: true }, 60);
            const { meta: { total_data: totalData } } = yield this.getPaginated(1, 1);
            const totalPage = Math.ceil(totalData / this.perPage);
            const pages = Array(totalPage).fill(1).map((_x, i) => i + 1);
            this.logger.info(`syncronizing total of ${totalData} datas of ${pages} pages`);
            yield bluebird.map(pages, (page) => this.getPaginated(page, this.perPage)
                .then(({ data: datas }) => datas.map(this.transform))
                .then((payloads) => this.event.publishBatch(this.topic, payloads))
                .then(() => utils_1.helpers.sleep(this.perBatchWait)), { concurrency: 1 });
        });
    }
}
exports.BatchPublishService = BatchPublishService;
exports.default = BatchPublishService;
