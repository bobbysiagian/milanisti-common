"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryptography = void 0;
const Cryptr = require("cryptr");
class Cryptography {
    static encrypt(key, value) {
        const cryptr = new Cryptr(key);
        return cryptr.encrypt(value);
    }
    static decrypt(key, value) {
        const cryptr = new Cryptr(key);
        return cryptr.decrypt(value);
    }
}
exports.Cryptography = Cryptography;
exports.default = Cryptography;
