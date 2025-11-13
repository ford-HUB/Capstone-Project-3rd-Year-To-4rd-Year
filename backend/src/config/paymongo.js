import axios from "axios";
import 'dotenv/config.js'

export const paymongo = axios.create({
    baseURL: "https://api.paymongo.com/v1",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
    },
});
