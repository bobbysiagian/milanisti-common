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
exports.FlagService = void 0;
const thruthyMap = {
    '1': true,
    'true': true,
    'on': true
};
class FlagService {
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: get feature flag data from System Parameter and replicate it on flags
        });
    }
    static set(key, isOn = true) {
        FlagService.flags[key] = isOn;
    }
    static isOn(key) {
        if (key in FlagService.flags) {
            return FlagService.flags[key];
        }
        const env = process.env[key];
        return env !== undefined && thruthyMap[env.toLocaleLowerCase()] || false;
    }
    isOn(key) {
        return FlagService.isOn(key);
    }
}
exports.FlagService = FlagService;
FlagService.flags = {};
exports.default = FlagService;
