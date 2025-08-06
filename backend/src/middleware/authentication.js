import passport from './passport.js'
import dotenv from 'dotenv'
dotenv.config()

export const jwtAuthenticate = passport.authenticate('jwt', { session: false })

 // Google Authentication
export const loginGoogle = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleCallback = passport.authenticate('google', {
  // successRedirect: `http://localhost:${process.env.FRONT_END_PORT}/donor/dashboard`,
  successRedirect: 'http://localhost:8000/api/donor-auth/protected',
  failureRedirect: 'http://localhost:8000/api/donor-auth/google/login',
  session: true
})

export const facebookLogin = passport.authenticate('facebook', { scope: ['public_profile', 'email'] })

export const facebookCallback = passport.authenticate('facebook', {
  // successRedirect: `http://localhost:${process.env.FRONT_END_PORT}/donor/dashboard`,
  successRedirect: 'http://localhost:8000/api/donor-auth/protected',
  failureRedirect: 'http://localhost:5173/',
  session: true
})


