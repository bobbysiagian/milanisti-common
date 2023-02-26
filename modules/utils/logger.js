"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const factory_1 = require("../factory");
class Logger {
    constructor(options = {}) {
        this._logger = factory_1.createLogerInstance(options);
    }
    get logger() {
        return this._logger;
    }
}
exports.Logger = Logger;
exports.default = Logger;
