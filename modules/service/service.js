"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const database_1 = require("../database");
const event_1 = require("../event");
const constant_1 = require("../utils/constant");
const logger_1 = require("../utils/logger");
const flag_service_1 = require("./flag_service");
class Service extends logger_1.default {
    constructor() {
        super({ source: constant_1.LOG_SOURCE.SERVICE });
        this.event = new event_1.EventPublisher();
        this.flag = new flag_service_1.default();
    }
    createTransaction() {
        return database_1.SQLContext.createTransaction();
    }
}
exports.Service = Service;
exports.default = Service;
