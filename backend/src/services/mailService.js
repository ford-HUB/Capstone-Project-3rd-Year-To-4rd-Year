import fs from 'node:fs/promises'
import path from "node:path"
import { dirname as getDirname } from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from 'dotenv'
import { transporter } from '../config/transporter.js'
// import { EmailParams, Recipient, Sender } from 'mailersend'
// import { mailer } from '../config/transporter.js'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = getDirname(__filename)


export const sendMail = async (to, subject, text, templateUsed, variables = {}) => {
    try {
        console.log(`📧 Attempting to send email to: ${to}`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Template: ${templateUsed}`);
        console.log(`📧 Variables:`, variables);
        
        const htmlTemplate = await fs.readFile(path.join(__dirname, '..', 'templates', templateUsed), 'utf-8');

        // catch the dynamic value using regex
        const htmlContent = htmlTemplate.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
            return variables[key.trim()] || '';
        });

        // const from = new Sender(process.env.AUTH_MAILER || "no-reply@uclmcares.online", "UCLM CARES")
        // const recipients = [new Recipient(to)]

        // const params = new EmailParams()
        // .setFrom(from)
        // .setTo(recipients)
        // .setSubject(subject)
        // .setHtml(htmlContent)

        console.log(`📧 Sending email via transporter...`);
        // const info = await mailer.email.send(params)
        const infomation = await transporter.sendMail({
            from: process.env.AUTH_MAILER,
            to: to,
            subject: subject,
            html: htmlContent,
            text: text.text || ''
        })

        console.log('✅ Email Sent Successfully: ', infomation.response)
        return { success: true, messageId: infomation.messageId };
    } catch (error) {
        console.log('❌ Send Mail Failed: ', error.message)
        console.log('❌ Full error:', error);
        throw error;
    }
}