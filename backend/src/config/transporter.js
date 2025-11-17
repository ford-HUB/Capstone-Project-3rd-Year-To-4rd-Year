import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
// import { MailerSend } from 'mailersend''

dotenv.config()

// export const mailer = new MailerSend({ apiKey: process.env.MAILER_API_KEY })
export const resend = new Resend(process.env.RESEND_MAILER_API_KEY)

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_MAILER,
        pass: process.env.PASS_MAILER, 
    },
})

