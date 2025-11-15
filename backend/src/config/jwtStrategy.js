import { Strategy, ExtractJwt } from "passport-jwt"
import models from "../models/index.js"
import dotenv from 'dotenv'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        // Priority 1: Check cookies first (primary auth method for non-donor users)
        (req) => {
            const cookieToken = req?.cookies?.jwt;
            // Log for attendance endpoints to debug 401 errors
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
        // Priority 2: Check Authorization header (for donor endpoints)
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
        // Priority 3: Check query token (skip for attendance endpoints - they have QR tokens in query)
        (req) => {
            // Skip query token extraction for attendance endpoints
            // They use 'token' query param for QR codes, not JWT tokens
            if (req?.path?.includes('/api/attendance/')) {
                return null;
            }
            
            const queryToken = req?.query?.token;
            // Basic validation: JWT tokens are typically longer and contain dots
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
        // Priority 4: Check body token
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
            console.error('[JWT Strategy] Invalid payload - no id found');
            return done(null, false);
        }
        
        console.log('[JWT Strategy] Strategy invoked:', { payloadId: jwt_payload.id });
        const { Accounts, Role } = models;
        const user = await Accounts.findOne({ 
            where: { account_id: jwt_payload.id },
            include: [{
                model: Role,
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] }
        })
        
        if(!user) { 
            console.error('[JWT Strategy] User not found for account_id:', jwt_payload.id);
            return done(null, false) 
        }

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