import { transporter } from '../config/transporter.js'
import fs from 'node:fs/promises'
import path from "node:path"
import { dirname as getDirname } from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from 'dotenv'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = getDirname(__filename)


export const sendMail = async (to, subject, text, templateUsed, variables = {}) => {
    try {
        const htmlTemplate = await fs.readFile(path.join(__dirname, '..', 'templates', templateUsed), 'utf-8');

        // catch the dynamic value using regex
        const htmlContent = htmlTemplate.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
            return variables[key.trim()] || '';
        });

        const infomation = await transporter.sendMail({
            from: process.env.AUTH_MAILER,
            to: to,
            subject: subject,
            html: htmlContent,
            text: text.text || ''
        })

        console.log('Email Sent: ', infomation.response)
    } catch (error) {
        console.log('Send Mail Failed: ', error.message)
    }
}