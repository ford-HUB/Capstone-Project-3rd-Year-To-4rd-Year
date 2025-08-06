import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()
export const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY })