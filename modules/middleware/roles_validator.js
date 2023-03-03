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
exports.RolesValidator = exports.getRoles = void 0;
const auth_1 = require("../libs/auth");
const http_error_1 = require("../utils/http_error");
const getRoles = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken) {
        return [];
    }
    const [type, token] = authorizationToken.split(' ');
    if (!token || type !== 'Bearer') {
        return [];
    }
    try {
        const tokenPayload = yield auth_1.default.verifyJwtToken(token);
        return tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.roles;
    }
    catch (err) {
        return [];
    }
});
exports.getRoles = getRoles;
const RolesValidator = (roles) => (req, _res, next) => {
    (0, exports.getRoles)(req)
        .then((userRoles) => {
        for (const role of roles) {
            for (const userRole of userRoles) {
                if (userRole.trim().toLowerCase() === role.trim().toLowerCase()) {
                    return next();
                }
            }
        }
        throw new http_error_1.ForbiddenError('your roles are not allowed to hit this endpoint', 'FORBIDDEN');
    })
        .catch((err) => next(err));
};
exports.RolesValidator = RolesValidator;
exports.default = exports.RolesValidator;
