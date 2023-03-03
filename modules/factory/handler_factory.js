"use strict";
/// <reference path="../typings/express.d.ts" />
/// <reference types="multer" />
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
exports.HandlerFactory = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const helpers_1 = require("../utils/helpers");
const parseInput = (req) => ({
    query: req.query,
    params: req.params,
    body: req.body,
    headers: req.headers,
    files: req.files || []
});
const getContext = (req) => {
    const context = (0, helpers_1.headersToContext)(req.headers);
    req.context = Object.assign(Object.assign({}, context), req.context);
    return req.context;
};
const getContentResponseHeader = (file) => {
    const { options } = file;
    return options ? {
        'Content-Type': options.mimeType,
        'Content-Disposition': `attachment;filename="${options.fileName}"`,
        'Content-Length': options.size.toString(),
    } : {};
};
const HandlerFactory = (method) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = parseInput(req);
        const context = getContext(req);
        /** make data and context immutable */
        Object.freeze(data);
        Object.freeze(context);
        const outData = yield method(data, context);
        res.set(constant_1.MANDATORY_REQUEST_HEADER.REQUEST_ID, context.request_id);
        if (outData === null || outData === void 0 ? void 0 : outData.file) {
            const { buffer } = outData.file;
            return res.set(getContentResponseHeader(outData.file)).end(buffer, 'binary');
        }
        if (outData === null || outData === void 0 ? void 0 : outData.html) {
            return res.set({ 'Content-Type': 'text/html' }).send(outData.html);
        }
        return res.json(outData).status((outData === null || outData === void 0 ? void 0 : outData.code) || http_status_codes_1.StatusCodes.OK);
    }
    catch (err) {
        return next(err);
    }
});
exports.HandlerFactory = HandlerFactory;
exports.default = exports.HandlerFactory;
