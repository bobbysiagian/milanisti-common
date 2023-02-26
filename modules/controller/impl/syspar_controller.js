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
exports.SystemParameterController = void 0;
const Joi = require("joi");
const controller_1 = require("../controller");
const UpsertSchema = Joi.object().keys({
    body: Joi.object().keys({
        code: Joi.string().max(15).required(),
        value: Joi.string().required(),
        description: Joi.string().max(255).optional().allow(null, '')
    })
});
const PaginateSchema = Joi.object().keys({
    query: Joi.object().keys({
        page: Joi.number().positive().integer().default(1),
        per_page: Joi.number().positive().integer().default(10),
        search: Joi.string().optional().allow(null, '')
    })
});
class SystemParameterController extends controller_1.default {
    constructor(sysparService) {
        super({ path: '/internal/system-parameter' });
        this.sysparService = sysparService;
    }
    paginateSyspar(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: systemParameters, meta } = yield this.sysparService
                .paginateSyspar(data.query.page, data.query.per_page, data.query.search);
            return {
                message: 'syspar list',
                data: {
                    content: systemParameters,
                    meta
                }
            };
        });
    }
    getSyspar(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const syspar = yield this.sysparService.getSysparByCode(data.params.code);
            return {
                message: 'syspar found',
                data: syspar
            };
        });
    }
    upsertSyspar(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = data;
            yield this.sysparService.upsertSyspar({
                code: body.code,
                value: body.value,
                description: body.description
            });
            return {
                message: 'syspar upserted'
            };
        });
    }
    setRoutes() {
        this.addRoute('get', '/', this.paginateSyspar.bind(this), { validate: PaginateSchema });
        this.addRoute('post', '/', this.upsertSyspar.bind(this), { validate: UpsertSchema });
        this.addRoute('get', '/:code', this.getSyspar.bind(this));
    }
}
exports.SystemParameterController = SystemParameterController;
exports.default = SystemParameterController;
