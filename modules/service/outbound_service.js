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
exports.OutboundService = void 0;
const axios_1 = require("axios");
const constant_1 = require("../utils/constant");
const http_error_1 = require("../utils/http_error");
const logger_1 = require("../utils/logger");
class OutboundService extends logger_1.default {
    constructor(url) {
        super({ source: constant_1.LOG_SOURCE.OUTBOUND_SERVICE });
        this.caller = axios_1.default.create({ baseURL: url });
    }
    doCall(path, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: response } = yield this.caller({
                method: (options === null || options === void 0 ? void 0 : options.method) || 'post',
                url: path, data,
                headers: options === null || options === void 0 ? void 0 : options.headers
            });
            return response;
        });
    }
    call(path, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.doCall(path, data, options);
            }
            catch (error) {
                this.logger.error(`outboud call to ${path} fail`, error);
                throw new http_error_1.InternalServerError(`outboud call ${path} fail, ${error.message}`, 'OUTBOUND_FAIL');
            }
        });
    }
    callAsync(path, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.doCall(path, data, options);
                }
                catch (error) {
                    this.logger.error(`outboud call to ${path} fail`, error);
                }
            }));
        });
    }
}
exports.OutboundService = OutboundService;
exports.default = OutboundService;
