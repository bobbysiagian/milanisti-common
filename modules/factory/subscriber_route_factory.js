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
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../utils/helpers");
const http_error_1 = require("../utils/http_error");
const SubscriberRouteFactory = (subscriber) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const context = helpers_1.headersToContext(req.headers);
            yield subscriber.handler(req.body || {}, context);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: `${subscriber.constructor.name} successfully executed`
            });
        }
        catch (error) {
            return next(new http_error_1.InternalServerError(`fail executing ${subscriber.constructor.name}, ${error.message}`));
        }
    });
};
exports.default = SubscriberRouteFactory;
