import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

export const encrypt = (value) => {
    return CryptoJS.AES.encrypt(
        value.toString(),
        process.env.CRYPTO_SECRET_KEY
    ).toString();
};


export const decrypt = (encrypted, isUrlEncoded = true) => {
    const encryptedString = isUrlEncoded ? decodeURIComponent(encrypted) : encrypted;
    const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.CRYPTO_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    // Check if decryption was successful
    if (!decrypted || decrypted.trim() === '') return null;
    
    return decrypted;
};

