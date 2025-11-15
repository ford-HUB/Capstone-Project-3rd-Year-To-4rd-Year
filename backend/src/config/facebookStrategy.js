import { Strategy as metaStrategy } from "passport-facebook"
import dotenv from 'dotenv'
import models from "../models/index.js"
dotenv.config()

const { Donor, Accounts, Role } = models

export const facebookStrategy = new metaStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.NODE_ENV === 'development' ? process.env.BACKEND_URL : process.env.BACKEND_URL_PROD}/api/donor-auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async(accessToken, refreshToken, profile, done) => {
    try {
        console.log('Facebook OAuth strategy:', { profileId: profile.id, email: profile.emails?.[0]?.value })
        const facebookAccount = await Donor.findOne({ where: { provider_id: profile.id } })

        if(!facebookAccount)
        {
            const newAccount = await Accounts.create({
                email: profile.emails ? profile.emails?.[0].value: profile.displayName,
                password: 'facebook oauth' 
            })

            await Role.create({
                account_id: newAccount.account_id,
                name: 'donor',
                description: 'This role allowed to donate into the event'
            })

            await Donor.create({
                account_id: newAccount.account_id,
                fullname: profile.displayName,
                provider_id: profile.id,
                auth_provider: 'Facebook',
                profile_image: profile.photos?.[0]?.value,
                is_verified: profile.emails?.[0].verified
            })

            const user = await Accounts.findByPk(newAccount.account_id, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            })
            return done(null, user)
        }  

        const user = await Accounts.findByPk(facebookAccount.account_id, {
            include: [{
                model: Role,
                attributes: ['name']
            }]
        })
        
        console.log('Facebook OAuth: Found existing account', {
            account_id: user?.account_id,
            email: user?.email,
            role: user?.Role?.name,
            donor_account_id: facebookAccount.account_id
        })
        
        // Verify the account has donor role
        if (!user || !user.Role || user.Role.name !== 'donor') {
            console.error('Facebook OAuth: Account found but role is not donor - REJECTING', {
                account_id: user?.account_id,
                email: user?.email,
                role: user?.Role?.name,
                expectedRole: 'donor'
            })
            return done(new Error(`Account does not have donor role. Current role: ${user?.Role?.name || 'none'}`), null)
        }
        
        console.log('Facebook OAuth: Account verified with donor role', { account_id: user.account_id })
        return done(null, user)

    } catch (error) {
        console.error('Facebook OAuth strategy failed:', {
            message: error.message,
            stack: error.stack,
            profileId: profile?.id
        });
        done(error, null);
    }
})