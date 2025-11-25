import { Strategy, ExtractJwt } from "passport-jwt"
import models from "../models/index.js"
import dotenv from 'dotenv'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            const cookieToken = req?.cookies?.jwt;
            if (req?.path?.includes('/api/attendance/')) {
                console.log('[JWT Extractor] Cookie check for attendance:', {
                    path: req.path,
                    hasCookies: !!req.cookies,
                    jwtCookie: !!cookieToken,
                    cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
                    cookiePreview: cookieToken ? `${cookieToken.substring(0, 20)}...` : 'none'
                });
            }
            if (req?.path === '/api/donor-auth/checkAuth') {
                console.log('JWT extractor (cookie) check:', {
                    hasCookie: !!cookieToken
                });
            }
            return cookieToken;
        },
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
            // Skip query token extraction for attendance endpoints
            // They use 'token' query param for QR codes, not JWT tokens
            if (req?.path?.includes('/api/attendance/')) {
                return null;
            }
            
            const queryToken = req?.query?.token;
            // JWT tokens are typically longer and contain dots
            // QR tokens are short alphanumeric strings (e.g., "D6EI8CA")
            if (queryToken && queryToken.length > 20 && queryToken.includes('.')) {
                if (req?.path === '/api/donor-auth/checkAuth') {
                    console.log('JWT extractor (query) check:', {
                        hasQueryToken: !!queryToken,
                        preview: queryToken ? `${queryToken.substring(0, 20)}...` : null
                    });
                }
                return queryToken;
            }
            return null;
        },
        // Check body token
        (req) => {
            const bodyToken = req?.body?.token;
            if (req?.path === '/api/donor-auth/checkAuth') {
                console.log('JWT extractor (body) check:', {
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
        if (!jwt_payload || !jwt_payload.id) {
            return done(null, false);
        }
        
        const { Accounts, Role } = models;
        const user = await Accounts.findOne({ 
            where: { account_id: jwt_payload.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] }
        })
        
        if(!user) { return done(null, false) }

        console.log('[JWT Strategy] User authenticated:', { 
            account_id: user.account_id, 
            email: user.email, 
            role: user.Role?.name 
        });
        return done(null, user)
        
    } catch (error) {
        console.error('[JWT Strategy] Strategy failed:', error.message);
        return done(null, false)
    }
})