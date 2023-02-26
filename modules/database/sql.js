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
exports.DBModule = void 0;
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const helpers_1 = require("../utils/helpers");
const opts = {
    dialect: 'postgres',
    logging: process.env.LOG_SQL ? console.log : false,
    pool: {
        min: 0,
        max: 10,
        idle: 10000,
        acquire: 20000
    },
    define: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
};
class DBModule {
    static initialize({ connection_string, models_path, read_replicas, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = {};
            let sequelize;
            if (read_replicas && read_replicas.length) {
                const replication = {
                    write: helpers_1.generateDatabaseConfig(connection_string),
                    read: read_replicas.map(helpers_1.generateDatabaseConfig)
                };
                const dbOptions = Object.assign(Object.assign(Object.assign({}, opts), options), { replication });
                sequelize = new Sequelize.Sequelize(connection_string, dbOptions);
            }
            else {
                sequelize = new Sequelize.Sequelize(connection_string, Object.assign(Object.assign({}, opts), options));
            }
            this.instance = {
                ORMProvider: Sequelize,
                context: sequelize,
                model: models,
                db_transaction: null
            };
            const modelsDir = path.join(__dirname, '../../../..', models_path);
            fs.readdirSync(modelsDir)
                .filter((file) => {
                const fileExtension = file.slice(-3);
                const isEligible = (fileExtension === '.js' || fileExtension === '.ts');
                return (file.indexOf('.') !== 0) && isEligible;
            })
                .forEach((fileName) => this.registerModel(modelsDir, fileName));
            /** initialize models relationship */
            Object.keys(models).forEach((modelName) => {
                const subModel = models[modelName];
                if (subModel && subModel.associate) {
                    subModel.associate(models);
                }
            });
        });
    }
    static registerModel(modelsDir, fileName) {
        const model = require(path.join(modelsDir, fileName));
        this.instance.model[model.name] = model;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance;
    }
    static getContext() {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.context;
    }
    static getORMProvider() {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.ORMProvider;
    }
    static getModel(modelName) {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.model[modelName];
    }
    static createTransaction(isolationLevel = this.instance.ORMProvider.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instance.context.transaction({ isolationLevel });
        });
    }
}
exports.DBModule = DBModule;
exports.default = DBModule;
