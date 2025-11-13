import CryptoJS from 'crypto-js';

export const encryptEventId = (eventId) => {
    return CryptoJS.AES.encrypt(
        eventId.toString(),
        import.meta.env.VITE_SECRET_KEY
    ).toString();
};

export const decryptEventId = (encrypted) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, import.meta.env.VITE_SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        console.error('Decryption error:', err);
        return null;
    }
};
