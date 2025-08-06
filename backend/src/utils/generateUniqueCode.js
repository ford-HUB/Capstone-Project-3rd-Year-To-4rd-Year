import { customAlphabet } from "nanoid"
import models from "../models/index.js"

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const generatedCode = customAlphabet(alphabet, 7)

const { VerificationCodes } = models

export const generateUniqueCode = async () => {

    let existCode = true
    let code = ''

    while (existCode) {
        code = generatedCode();
        const found = await VerificationCodes.findOne({ where: { code: code } });
        existCode = !!found; // if found, loop again
    }

    return code;

}