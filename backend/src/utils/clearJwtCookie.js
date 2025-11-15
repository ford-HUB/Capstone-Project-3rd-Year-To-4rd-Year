import dotenv from 'dotenv'

dotenv.config()

export const clearJwtCookie = (res) => {
    const isProd = process.env.NODE_ENV === 'production'
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax',
        path: '/'
    }

    if (isProd && process.env.COOKIE_DOMAIN) {
        options.domain = process.env.COOKIE_DOMAIN
    }

    res.clearCookie('jwt', options)
}

