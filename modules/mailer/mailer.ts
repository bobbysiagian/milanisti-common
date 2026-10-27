import * as nodemailer from 'nodemailer'

interface IMailerOpts {
    host?: string
    port?: number
    username: string
    password: string
}

export interface IMailerPayload {
    fromName?: string
    fromEmail?: string
    to: string[]
    cc?: string[]
    bcc?: string[]
    subject: string
    message: string
    isHTML: boolean
}

export type MailerInstance = {
    username: string
    mailerClient: nodemailer.Transporter
}

export class Mailer {
    private static instance: MailerInstance

    public static initialize({
        host = 'smtp.gmail.com',
        port = 587,
        username,
        password,
    }: IMailerOpts) {
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
        }

        this.instance.mailerClient.verify().then(res => {
            if (!res) {
                throw "failed to verify mailer credential"
            }
        }).catch((err: any) => {
            console.error(err)
            throw err
        })
    }

    public static async sendEmail({ fromName, fromEmail, to, cc, bcc, subject, message, isHTML }: IMailerPayload): Promise<nodemailer.SentMessageInfo> {
        let from = ''
        let text = ''
        let html = ''
        
        if (fromName) from = `"${fromName}"`
        else from = `"${this.instance.username}"`

        if (fromEmail) from += ` <${fromEmail}>`
        else from += ` <${this.instance.username}>`

        if (isHTML) html = message
        else text = message

        return await this.instance.mailerClient.sendMail({
            from,
            to,
            cc,
            bcc,
            subject,
            text,
            html,
        }).then((resp) => {
            return resp
        }).catch((err: any) => {
            console.error(err)
            throw err
        })
    }
}

export default Mailer
