import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
      user: process.env.AUTH_MAILER,
      pass: process.env.PASS_MAILER, 
  },
})