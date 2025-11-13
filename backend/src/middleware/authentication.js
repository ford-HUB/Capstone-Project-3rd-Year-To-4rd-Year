import passport from './passport.js'
import dotenv from 'dotenv'
dotenv.config()

export const jwtAuthenticate = passport.authenticate('jwt', { session: false })

 // Google Authentication
export const loginGoogle = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleCallback = passport.authenticate('google', {
  successRedirect: `/api/donor-auth/oauth-success`,
  failureRedirect: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donor/login?error=oauth_failed`,
  session: true
})

export const facebookLogin = passport.authenticate('facebook', { scope: ['public_profile', 'email'] })

export const facebookCallback = passport.authenticate('facebook', {
  successRedirect: `/api/donor-auth/oauth-success`,
  failureRedirect: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donor/login?error=oauth_failed`,
  session: true
})


