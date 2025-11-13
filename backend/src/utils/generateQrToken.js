import { customAlphabet } from "nanoid"
import models from "../models/index.js"

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const generatedCode = customAlphabet(alphabet, 7)

const { EventQRCode } = models

export const generateQrToken = async () => {

    let existToken = true
    let token = ''

    while (existToken) {
        token = generatedCode();
        const found = await EventQRCode.findOne({ where: { token: token } });
        existToken = !!found; // if found, loop again
    }

    return token;

}