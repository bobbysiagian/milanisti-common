"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMiddleware = exports.DEFAULT_FILE_FIELD_NAME = void 0;
const multer = require("multer");
exports.DEFAULT_FILE_FIELD_NAME = 'files';
const UploadMiddleware = () => {
    return multer().array(exports.DEFAULT_FILE_FIELD_NAME);
};
exports.UploadMiddleware = UploadMiddleware;
exports.default = exports.UploadMiddleware;
