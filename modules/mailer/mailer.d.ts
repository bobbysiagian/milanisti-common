import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
interface IMailerOpts {
    host?: string;
    port?: number;
    username: string;
    password: string;
}
export interface IMailerPayload {
    fromName?: string;
    fromEmail?: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    isHTML: boolean;
}
export declare type MailerInstance = {
    username: string;
    mailerClient: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
};
export declare class Mailer {
    private static instance;
    static initialize({ host, port, username, password, }: IMailerOpts): void;
    static sendEmail({ fromName, fromEmail, to, cc, bcc, subject, message, isHTML }: IMailerPayload): Promise<SMTPTransport.SentMessageInfo>;
}
export default Mailer;
//# sourceMappingURL=mailer.d.ts.map