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
        console.log(`📧 Attempting to send email to: ${to}`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Template: ${templateUsed}`);
        console.log(`📧 Variables:`, variables);
        
        const htmlTemplate = await fs.readFile(path.join(__dirname, '..', 'templates', templateUsed), 'utf-8');

        // catch the dynamic value using regex
        const htmlContent = htmlTemplate.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
            return variables[key.trim()] || '';
        });

        console.log(`📧 Sending email via transporter...`);
        const infomation = await transporter.emails.send({
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