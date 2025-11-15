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
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('Email is required for Google OAuth'), null);
        }

        // First, check if Donor account exists with this provider_id
        let googleAccount = await Donor.findOne({ where: { provider_id: profile.id } })

        if(!googleAccount) {
            // Check if email already exists in Accounts
            const existingAccount = await Accounts.findOne({ where: { email: email } });
            
            if (existingAccount) {
                // Check if this account already has a Donor record
                const existingDonor = await Donor.findOne({ where: { account_id: existingAccount.account_id } });
                
                if (existingDonor) {
                    // Account exists with Donor record but different provider_id
                    // Update the provider_id to link this OAuth account
                    await Donor.update(
                        { 
                            provider_id: profile.id,
                            auth_provider: 'Google',
                            profile_image: profile.photos?.[0]?.value,
                            is_verified: profile.emails?.[0]?.verified
                        },
                        { where: { account_id: existingAccount.account_id } }
                    );
                    
                    const user = await Accounts.findByPk(existingAccount.account_id, {
                        include: [{
                            model: Role,
                            attributes: ['name']
                        }]
                    });
                    
                    // If no role exists, create donor role (since we have a Donor record)
                    if (!user.Role) {
                        await Role.create({
                            account_id: existingAccount.account_id,
                            name: 'donor',
                            description: 'This role allowed to donate into the event'
                        });
                        
                        // Reload user with role
                        const userWithRole = await Accounts.findByPk(existingAccount.account_id, {
                            include: [{
                                model: Role,
                                attributes: ['name']
                            }]
                        });
                        return done(null, userWithRole);
                    }
                    
                    // Verify donor role
                    if (user.Role.name !== 'donor') {
                        console.error('Google OAuth: Existing account does not have donor role', {
                            account_id: user.account_id,
                            email: user.email,
                            role: user.Role.name
                        });
                        return done(new Error(`Account does not have donor role. Current role: ${user.Role.name}`), null);
                    }
                    
                    return done(null, user);
                } else {
                    // Account exists but no Donor record - check role
                    const accountWithRole = await Accounts.findByPk(existingAccount.account_id, {
                        include: [{
                            model: Role,
                            attributes: ['name']
                        }]
                    });
                    
                    if (accountWithRole?.Role?.name === 'donor') {
                        // Create Donor record for existing account
                        await Donor.create({
                            account_id: existingAccount.account_id,
                            fullname: profile.displayName,
                            provider_id: profile.id,
                            auth_provider: 'Google',
                            profile_image: profile.photos?.[0]?.value,
                            is_verified: profile.emails?.[0]?.verified
                        });
                        
                        return done(null, accountWithRole);
                    } else {
                        return done(new Error(`Email already registered with role: ${accountWithRole?.Role?.name || 'none'}. Please use a different email or login with your existing account.`), null);
                    }
                }
            } else {
                // New account - create everything
                const newAccount = await Accounts.create({
                    email: email,
                    password: 'google oauth' 
                });

                await Role.create({
                    account_id: newAccount.account_id,
                    name: 'donor',
                    description: 'This role allowed to donate into the event'
                });

                await Donor.create({
                    account_id: newAccount.account_id,
                    fullname: profile.displayName,
                    provider_id: profile.id,
                    auth_provider: 'Google',
                    profile_image: profile.photos?.[0]?.value,
                    is_verified: profile.emails?.[0]?.verified
                });

                const user = await Accounts.findByPk(newAccount.account_id, {
                    include: [{
                        model: Role,
                        attributes: ['name']
                    }]
                });
                return done(null, user);
            }
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
                email: user?.email,
                role: user?.Role?.name
            })
            return done(new Error(`Account does not have donor role. Current role: ${user?.Role?.name || 'none'}`), null)
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

