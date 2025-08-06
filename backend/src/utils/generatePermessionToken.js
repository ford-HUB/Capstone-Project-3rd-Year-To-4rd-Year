import { customAlphabet } from "nanoid"
import models from "../models/index.js"

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const generatedToken = customAlphabet(alphabet, 7)

const { ApprovalToken } = models

export const generateUniqueToken = async () => {

    let existCode = true
    let token = ''

    while (existCode) {
        token = generatedToken();
        const found = await ApprovalToken.findOne({ where: { token: token } });
        existCode = !!found; // if found, loop again
    }

    return token;

}