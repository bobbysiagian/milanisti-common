"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidator = void 0;
const validator_1 = require("../libs/validator");
const RequestValidator = (schema) => (req, res, next) => {
    const { query, params, body, files, headers } = req;
    return (0, validator_1.default)({ query, params, body, files, headers }, schema)
        .then((validated) => {
        req.query = validated.query;
        req.params = validated.params;
        req.body = validated.body;
        return next();
    })
        .catch((err) => next(err));
};
exports.RequestValidator = RequestValidator;
exports.default = exports.RequestValidator;
