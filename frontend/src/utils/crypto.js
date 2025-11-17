import CryptoJS from 'crypto-js';

export const encrypt = (value) => {
    return CryptoJS.AES.encrypt( value.toString(),
        import.meta.env.VITE_SECRET_KEY
    ).toString();
};


export const decrypt = (encrypted) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, import.meta.env.VITE_SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        console.error('Decryption error:', err);
        return null;
    }
};


export const encryptEventId = (eventId) => {
    return encrypt(eventId);
};

export const decryptEventId = (encrypted) => {
    return decrypt(encrypted);
};
