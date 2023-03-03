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
exports.SQLRepository = void 0;
const sql_1 = require("../database/sql");
const helpers_1 = require("../utils/helpers");
const http_error_1 = require("../utils/http_error");
const DEFAULT = {
    SORT: '-created_at'
};
class SQLRepository extends sql_1.default {
    constructor(modelName) {
        super();
        this.modelName = modelName;
    }
    createTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return sql_1.default.createTransaction();
        });
    }
    getInstance() {
        return sql_1.default.getInstance();
    }
    findById(id, attributes, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName]
                .findOne({
                where: { id },
                attributes,
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            })
                .then(res => res ? res.get() : null);
        });
    }
    findOne(conditions, attributes, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName]
                .findOne({
                where: conditions,
                attributes,
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            })
                .then(res => res ? res.get() : null);
        });
    }
    findOneOrFail(conditions, attributes, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne(conditions, attributes, opts)
                .then((res) => {
                if (!res) {
                    throw new http_error_1.NotFoundError(`${(0, helpers_1.camelToSnakeCase)(this.modelName).toUpperCase()}_NOT_FOUND`);
                }
                return res;
            });
        });
    }
    findAll(conditions, { sort = DEFAULT.SORT, attributes }, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = (0, helpers_1.sorter)(sort || DEFAULT.SORT);
            const db = this.getInstance();
            return db.model[this.modelName]
                .findAll({
                where: conditions,
                attributes,
                order: [order],
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            })
                .then(rows => rows.map(row => row.get()));
        });
    }
    upsert(search, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne(search).then((row) => {
                return row ? this.update(search, data) : this.create(data, opts);
            });
        });
    }
    create(data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName]
                .create(data, { transaction: opts === null || opts === void 0 ? void 0 : opts.transaction })
                .then(res => res.get());
        });
    }
    createMany(data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName]
                .bulkCreate(data, { transaction: opts === null || opts === void 0 ? void 0 : opts.transaction })
                .then(rows => rows.map(row => row.get()));
        });
    }
    update(conditions, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName].update(data, {
                where: conditions,
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            });
        });
    }
    delete(conditions, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName].destroy({
                where: conditions,
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            });
        });
    }
    increment(conditions, fields, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName].increment(fields, {
                where: conditions,
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            });
        });
    }
    count(conditions, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getInstance();
            return db.model[this.modelName].count({ where: conditions, transaction: opts === null || opts === void 0 ? void 0 : opts.transaction });
        });
    }
    mapPaginate(page, perPage, { rows, count }) {
        return {
            data: rows.map(row => row.get()),
            meta: {
                page,
                per_page: perPage,
                total_page: Math.ceil(count / perPage),
                total_data: count
            }
        };
    }
    paginate(conditions, { page = 1, per_page = 10, sort = DEFAULT.SORT, attributes }, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = (0, helpers_1.sorter)(sort);
            const db = this.getInstance();
            return db.model[this.modelName]
                .findAndCountAll({
                where: conditions,
                attributes,
                limit: per_page,
                offset: (0, helpers_1.offset)(page, per_page),
                order: [order],
                transaction: opts === null || opts === void 0 ? void 0 : opts.transaction
            })
                .then(data => this.mapPaginate(page, per_page, data));
        });
    }
}
exports.SQLRepository = SQLRepository;
exports.default = SQLRepository;
