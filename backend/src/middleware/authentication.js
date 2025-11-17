import passport from './passport.js'
import dotenv from 'dotenv'
dotenv.config()

export const jwtAuthenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('[JWT Auth] Authentication error:', err);
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }
        
        if (!user) {
            console.error('[JWT Auth] Authentication failed - no user:', {
                path: req.path,
                hasCookies: !!req.cookies,
                jwtCookie: !!req.cookies?.jwt,
                cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
                info: info?.message || 'No token provided'
            });
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in again.' });
        }
        
        req.user = user;
        next()
    })(req, res, next);
}

 // Google Authentication
export const loginGoogle = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleCallback = passport.authenticate('google', {
    successRedirect: `/api/donor-auth/oauth-success`,
    failureRedirect: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donor/login?error=oauth_failed`,
    session: true
})

// Facebook Authentication
export const facebookLogin = passport.authenticate('facebook', { scope: ['public_profile', 'email'] })

export const facebookCallback = passport.authenticate('facebook', {
  successRedirect: `/api/donor-auth/oauth-success`,
  failureRedirect: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donor/login?error=oauth_failed`,
  session: true
})


