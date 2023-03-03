"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const bcrypt = require("bcryptjs");
const fs_1 = require("fs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const random = require("randomstring");
class Auth {
    static getKey() {
        let privateKey = String(process.env.JWT_SECRET || 'default');
        let publicKey = String(process.env.JWT_SECRET || 'default');
        if (String(process.env.JWT_USE_PAIR_KEY) == 'true') {
            const privateKeyFile = (0, fs_1.readFileSync)(String(process.env.JWT_PRIVATE_KEY_PATH || ''));
            const publicKeyFile = (0, fs_1.readFileSync)(String(process.env.JWT_PUBLIC_KEY_PATH || ''));
            privateKey = privateKeyFile.toString();
            publicKey = publicKeyFile.toString();
        }
        return { privateKey, publicKey };
    }
    static generateToken(claims, withLifetime = true) {
        const lifetime = Number(process.env.JWT_LIFETIME || 3600);
        const options = {};
        if (withLifetime) {
            options.expiresIn = lifetime;
        }
        const token = jwt.sign(claims, this.getKey().privateKey, options);
        return {
            token,
            lifetime
        };
    }
    static verifyJwtToken(token) {
        return jwt.verify(token, this.getKey().publicKey);
    }
    static generateRefreshToken() {
        return {
            token: random.generate(Auth.REFRESH_TOKEN_LENGTH),
            valid_until: moment().add(Auth.REFRESH_TOKEN_LIFETIME, 'days').utc().format()
        };
    }
    static generateHash(password) {
        return bcrypt.hashSync(password, Auth.SALT);
    }
}
exports.Auth = Auth;
Auth.SALT = 10;
Auth.REFRESH_TOKEN_LENGTH = 50;
Auth.REFRESH_TOKEN_LIFETIME = 7; // days
Auth.validatePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};
exports.default = Auth;
