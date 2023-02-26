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
exports.SystemParameterService = void 0;
const database_1 = require("../database");
const service_1 = require("./service");
class SystemParameterService extends service_1.default {
    constructor(sysParRepo, cacheService) {
        super();
        this.cacheKey = 'syspar-';
        this.sysParRepo = sysParRepo;
        this.cacheService = cacheService;
    }
    upsertSyspar(props) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sysParRepo.upsert({ code: props.code }, props);
            yield this.cacheService.delete(this.cacheKey + props.code);
        });
    }
    getSysparByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.cacheKey + code;
            let syspar = yield this.cacheService.get(key);
            if (!syspar) {
                syspar = yield this.sysParRepo.findOneOrFail({ code });
                yield this.cacheService.set(key, syspar);
            }
            return syspar;
        });
    }
    paginateSyspar(page, perPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Op } = database_1.SQLContext.getORMProvider();
            const conditions = search ? { code: { [Op.iLike]: '%search%' } } : {};
            return this.sysParRepo.paginate(conditions, { page, per_page: perPage });
        });
    }
}
exports.SystemParameterService = SystemParameterService;
exports.default = SystemParameterService;
