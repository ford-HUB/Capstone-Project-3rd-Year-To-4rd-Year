import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });