import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = async (payload_id, res) => {
    try {
        const token = jwt.sign({ id: payload_id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' } )

        const isProd = process.env.NODE_ENV === 'production'
        const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax', // cross-site request forgery protection
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
        }

        // If using shared parent domain across FE/BE, set COOKIE_DOMAIN
        if (isProd && process.env.COOKIE_DOMAIN) {
            cookieOptions.domain = process.env.COOKIE_DOMAIN
        }

        res.cookie('jwt', token, cookieOptions);

        return token

    } catch (error) {
        console.log('generateToken failed: ', error.message)
    }
}