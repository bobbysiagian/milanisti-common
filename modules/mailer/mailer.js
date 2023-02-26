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
exports.Mailer = void 0;
const nodemailer = require("nodemailer");
class Mailer {
    static initialize({ host = 'smtp.gmail.com', port = 587, username, password, }) {
        this.instance = {
            username,
            mailerClient: nodemailer.createTransport({
                host,
                port,
                auth: {
                    user: username,
                    pass: password,
                },
            }),
        };
        this.instance.mailerClient.verify().then(res => {
            if (!res) {
                throw "failed to verify mailer credential";
            }
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    }
    static sendEmail({ fromName, fromEmail, to, cc, bcc, subject, message, isHTML }) {
        return __awaiter(this, void 0, void 0, function* () {
            let from = '';
            let text = '';
            let html = '';
            if (fromName)
                from = `"${fromName}"`;
            else
                from = `"${this.instance.username}"`;
            if (fromEmail)
                from += ` <${fromEmail}>`;
            else
                from += ` <${this.instance.username}>`;
            if (isHTML)
                html = message;
            else
                text = message;
            return yield this.instance.mailerClient.sendMail({
                from,
                to,
                cc,
                bcc,
                subject,
                text,
                html,
            }).then((resp) => {
                return resp;
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });
    }
}
exports.Mailer = Mailer;
exports.default = Mailer;
