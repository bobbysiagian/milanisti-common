"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemParameterRepository = void 0;
const sql_repository_1 = require("../sql_repository");
class SystemParameterRepository extends sql_repository_1.default {
    constructor() {
        super('SystemParameter');
    }
}
exports.SystemParameterRepository = SystemParameterRepository;
exports.default = SystemParameterRepository;
