// import { MailerSend } from 'mailersend'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// export const mailer = new MailerSend({ apiKey: process.env.MAILER_API_KEY })

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,    
    secure: false,
    auth: {
      user: process.env.AUTH_MAILER,
      pass: process.env.PASS_MAILER, 
    },
})