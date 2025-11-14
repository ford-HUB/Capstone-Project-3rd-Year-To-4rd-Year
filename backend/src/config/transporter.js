import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = new Resend(process.env.MAILER_API_KEY)

// export const transporter = nodemailer.createTransport({
//     host: 'smtp.titan.email',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.AUTH_MAILER,
//       pass: process.env.PASS_MAILER, 
//   },
// })