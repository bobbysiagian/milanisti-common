import * as nodemailer from 'nodemailer';
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
export type MailerInstance = {
    username: string;
    mailerClient: nodemailer.Transporter;
};
export declare class Mailer {
    private static instance;
    static initialize({ host, port, username, password, }: IMailerOpts): void;
    static sendEmail({ fromName, fromEmail, to, cc, bcc, subject, message, isHTML }: IMailerPayload): Promise<nodemailer.SentMessageInfo>;
}
export default Mailer;
//# sourceMappingURL=mailer.d.ts.map