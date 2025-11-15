import { Strategy, ExtractJwt } from "passport-jwt"
import models from "../models/index.js"
import dotenv from 'dotenv'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
        return req?.cookies?.jwt
}]), 
    secretOrKey: process.env.JWT_SECRET_KEY
}

export const jwtStrategy = new Strategy(options, async (jwt_payload, done) => {
    try {
        const { Accounts, Role } = models;
        const user = await Accounts.findOne({ 
            where: { account_id: jwt_payload.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],attributes: { exclude: ['password'] }  })
        
        if(!user) { 
            return done(null, false) 
        }

        return done(null, user)
        
    } catch (error) {
        console.error('jwt strategy failed: ', error.message)
        return done(null, false)
    }
})