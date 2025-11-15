import { Strategy, ExtractJwt } from "passport-jwt"
import models from "../models/index.js"
import dotenv from 'dotenv'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
        const cookieToken = req?.cookies?.jwt
        if (req?.path === '/api/donor-auth/checkAuth') {
            console.log('jwt extractor:', {
                hasAuthHeader: !!req?.headers?.authorization,
                hasCookie: !!cookieToken
            })
        }
        return cookieToken
}]),
    secretOrKey: process.env.JWT_SECRET_KEY
}

export const jwtStrategy = new Strategy(options, async (jwt_payload, done) => {
    try {
        console.log('jwtStrategy invoked', { payloadId: jwt_payload?.id })
        const { Accounts, Role } = models;
        const user = await Accounts.findOne({ 
            where: { account_id: jwt_payload.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],attributes: { exclude: ['password'] }  })
        
        if(!user) { 
            console.log('jwtStrategy user not found for id:', jwt_payload?.id)
            return done(null, false) 
        }

        return done(null, user)
        
    } catch (error) {
        console.log('jwt strategy failed: ', error.message)
        return done(null, false)
    }
})