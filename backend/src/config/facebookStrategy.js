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
        return done(null, user)

    } catch (error) {
        console.error('Facebook OAuth strategy failed:', error.message)
        done(error, null)
    }
})