import { Strategy, ExtractJwt } from "passport-jwt"
import models from "../models/index.js"
import dotenv from 'dotenv'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            const authHeaderExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
            const token = authHeaderExtractor(req);
            if (req?.path === '/api/donor-auth/checkAuth') {
                console.log('JWT extractor (auth header) check:', {
                    hasAuthHeader: !!token,
                    headerPreview: token ? `${token.substring(0, 20)}...` : null
                });
            }
            return token;
        },
        (req) => {
            const cookieToken = req?.cookies?.jwt;
            if (req?.path === '/api/donor-auth/checkAuth') {
                console.log('JWT extractor (cookie) check:', {
                    hasCookie: !!cookieToken
                });
            }
            return cookieToken;
        },
        ExtractJwt.fromUrlQueryParameter('token'),
        (req) => {
            const bodyToken = req?.body?.token;
            if (req?.path === '/api/donor-auth/checkAuth') {
                console.log('JWT extractor (body/query) check:', {
                    hasQueryToken: !!req?.query?.token,
                    hasBodyToken: !!bodyToken
                });
            }
            return bodyToken;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET_KEY
}

export const jwtStrategy = new Strategy(options, async (jwt_payload, done) => {
    try {
        console.log('JWT strategy invoked:', { payloadId: jwt_payload?.id });
        const { Accounts, Role } = models;
        const user = await Accounts.findOne({ 
            where: { account_id: jwt_payload.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],attributes: { exclude: ['password'] }  })
        
        if(!user) { 
            console.log('JWT strategy: User not found for account_id:', jwt_payload?.id);
            return done(null, false) 
        }

        console.log('JWT strategy: User found:', { account_id: user.account_id, email: user.email, role: user.Role?.name });
        return done(null, user)
        
    } catch (error) {
        console.error('jwt strategy failed: ', error.message)
        return done(null, false)
    }
})