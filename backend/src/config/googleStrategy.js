import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import models from "../models/index.js";
import dotenv from 'dotenv'
dotenv.config()

const { Accounts, Donor, Role } = models

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NODE_ENV === 'development' ? process.env.BACKEND_URL : process.env.BACKEND_URL_PROD}/api/donor-auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth strategy:', { profileId: profile.id, email: profile.emails?.[0]?.value })
        const googleAccount = await Donor.findOne({ where: { provider_id: profile.id } })

        if(!googleAccount)
        {
            const newAccount = await Accounts.create({
                email: profile.emails?.[0].value,
                password: 'google oauth' 
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
                auth_provider: 'Google',
                profile_image: profile.photos?.[0].value,
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

        const user = await Accounts.findByPk(googleAccount.account_id, {
            include: [{
                model: Role,
                attributes: ['name']
            }]
        })
        
        // Verify the account has donor role
        if (!user || !user.Role || user.Role.name !== 'donor') {
            console.error('Google OAuth: Account found but role is not donor', {
                account_id: user?.account_id,
                role: user?.Role?.name
            })
            return done(new Error('Account does not have donor role'), null)
        }
        
        return done(null, user)

    } catch (error) {
        console.error('Google OAuth strategy failed:', {
            message: error.message,
            stack: error.stack,
            profileId: profile?.id
        });
        done(error, null);
    }
  }
);

