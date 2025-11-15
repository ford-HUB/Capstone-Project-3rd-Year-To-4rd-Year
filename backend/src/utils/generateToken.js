import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = async (payload_id, res) => {
    try {
        if (!payload_id) {
            throw new Error('Payload ID is required for token generation');
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not configured');
        }

        const token = jwt.sign({ id: payload_id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true, // Prevent XSS attacks
            secure: isProd, // HTTPS only in production
            sameSite: isProd ? 'None' : 'Lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        };

        // If using shared parent domain across FE/BE, set COOKIE_DOMAIN
        if (isProd && process.env.COOKIE_DOMAIN) {
            cookieOptions.domain = process.env.COOKIE_DOMAIN;
        }

        res.cookie('jwt', token, cookieOptions);
        return token;
    } catch (error) {
        console.error('generateToken failed:', error.message, error.stack);
        throw error; // Re-throw to allow caller to handle
    }
}