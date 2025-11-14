import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = async (payload_id, res) => {
    try {
        const token = jwt.sign({ id: payload_id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' } )

        res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // cross-site request forgery protection
        maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return token

    } catch (error) {
        console.log('generateToken failed: ', error.message)
    }
}