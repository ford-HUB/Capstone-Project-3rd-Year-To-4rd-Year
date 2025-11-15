import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { generateUniqueCode } from "../../utils/generateUniqueCode.js"
import { generateToken } from "../../utils/generateToken.js"
import { sendMail } from "../../services/mailService.js"
import bcrypt from 'bcrypt'

const FRONTEND_URL = process.env.NODE_ENV === 'development'
    ? process.env.FRONT_END_URL
    : process.env.FRONTEND_URL_PROD

export const signup = async (req, res) => {
    const t = await db.transaction()
    try {
        const { fullname, email, password, confirmPassword } = req.validatedBody

        console.log(email)

        const { Accounts, VerificationCodes, Role, Donor } = models

        const isEmailExist = await Accounts.findOne({ where: { email: email } })
        if(isEmailExist) {
            t.rollback()
            return res.json({ message: 'your email is already registered' })
        }

        const truePassword = password || confirmPassword

        let salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(truePassword, salt)

        const newAccount = await Accounts.create({
            email: email,
            password: hashPassword,
        }, { transaction: t })

        await Role.create({
            account_id: newAccount.account_id,
            name: 'donor',
            description: 'this role allowed to donate'
        }, { transaction: t })

        await Donor.create({
            account_id: newAccount.account_id,
            provider_id: newAccount.account_id.toString(),
            auth_provider: 'local',
            fullname: fullname,
            is_verified: false
        }, { transaction: t })

        const uniqueCode = await generateUniqueCode()
        await sendMail(email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })
        
        // const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expireration to 5 minutes
        const ONE_MINUTE = new Date(Date.now() + 60_000); // debugging purposes
        
        await VerificationCodes.create({
            account_id: newAccount.account_id,
            code: uniqueCode,
            expires_at: ONE_MINUTE, 
            used: false
        }, { transaction: t })
        
        await generateToken(newAccount.account_id, res)
        await t.commit()
        res.json({ success: true, message: "Account Successfully Registered", otp_expiration: ONE_MINUTE })


    } catch (error) {
        t.rollback()
        res.json({ message: 'Internal Server Error' })
        console.log('signup donor failed:', error.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedBody

        const { Accounts, VerificationCodes } = models

        const isValid = await Accounts.findOne({ where: { email: email } })
        if(!isValid) { return res.json({ message: 'Invalid Credentials' }) }
        
        const isVerified = await VerificationCodes.findOne({ where: { account_id: isValid.account_id } })
        if(!isVerified || !isVerified.used) { return res.json({ message: 'Account Not Verified' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

        // Set user as active
        await Accounts.update({ is_active: true }, { where: { account_id: isValid.account_id } })

        await generateToken(isValid.account_id, res)

        res.json({ success: true, message: 'Login Successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}

export const logout = async (req, res) => {
    try {
        const { Accounts } = models;
        const accountId = req.user.account_id;

        // Set user as inactive - await to ensure it completes before OAuth logout
        await Accounts.update({ is_active: false }, { where: { account_id: accountId } });

        req.logout(() => {
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.clearCookie('jwt', {
                    httpOnly: true,
                    sameSite: true,
                    secure: process.env.NODE_ENV === 'production'
                });

                res.json({ success: true, message: 'Logout successful' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.error('logout controller failed :', error.message);
    }
}


export const VerifyCode = async (req, res) => {
    try {
        const { code } = req.body
        const { VerificationCodes } = models
        const accountId = req.user.account_id

        const isMatch = await VerificationCodes.findOne({ where: { account_id: accountId, code: code } })
        if(!isMatch) { return res.json({ message: 'Verification Code Does not Match' }) }

        if(isMatch.used) { return res.json({ message: 'Verification Code Already Used, Please attempt resend code' }) }

        const now = Date.now()
        const expiresAt = new Date(isMatch.expires_at)
        if(now > expiresAt) { return res.json({ message: 'Verification Code is Expired' }) }

        const updateStatus = await VerificationCodes.update({ used: true }, { where: { vc_id: isMatch.vc_id } })
        if(!updateStatus) { return res.json({ message: 'verification code is not successfully updated the status' }) }

        res.json({ success: true, message: 'Verification Code Accepted' })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('VerifyCode controller failed :', error.message)
    }
}


export const reSendCode = async (req, res) => {
    try {

        const { VerificationCodes } = models

        const user = req.user
        const uniqueCode = await generateUniqueCode()
        await sendMail(user.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })

        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expireration to 5 minutes

        await VerificationCodes.update({
            account_id: user.account_id,
            code: uniqueCode,
            expires_at: FIVE_MINUTES,
            used: false,    
        }, { 
            where: {
                account_id: user.account_id
            }
        })

        res.json({ success: true, message: "New OTP sent to your email", otp_expiration: FIVE_MINUTES })
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Resend Code controller failed :', error.message)
    }
}


export const checkAuth = async (req, res) => {
    try {
        res.json({success: true, message: 'user authenticated', user: req.user})
    } catch (error) {
        console.error('Check Auth controller failed :', error.message)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const checkEmailForPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        const { Accounts, Donor, Role } = models;
        
        // Check if email exists and is a donor account
        const account = await Accounts.findOne({
            where: { email: email },
            include: [
                {
                    model: Role,
                    attributes: ['name'],
                    where: { name: 'donor' },
                    required: true
                },
                {
                    model: Donor,
                    attributes: ['fullname', 'auth_provider', 'provider_id'],
                    required: false
                }
            ],
            paranoid: false
        });
        
        if (!account) {
            return res.json({ 
                success: true, 
                exists: false,
                message: 'Email not found in donor accounts' 
            });
        }

        // Check if account is from OAuth (not local registration)
        if (account.Donor && account.Donor.auth_provider !== 'local') {
            return res.json({ 
                success: true, 
                exists: true,
                isOAuth: true,
                account: {
                    account_id: account.account_id,
                    email: account.email,
                    is_active: account.is_active,
                    is_deactivated: account.is_deactivated,
                    fullname: account.Donor?.fullname || 'User',
                    auth_provider: account.Donor.auth_provider
                },
                message: 'This account was registered via OAuth. Password reset is not available for OAuth accounts.'
            });
        }

        // Return account details for status checking
        return res.json({ 
            success: true, 
            exists: true,
            isOAuth: false,
            account: {
                account_id: account.account_id,
                email: account.email,
                is_active: account.is_active,
                is_deactivated: account.is_deactivated,
                fullname: account.Donor?.fullname || 'User'
            },
            message: 'Email found'
        });
    } catch (error) {
        console.error('checkEmailForPasswordReset controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.validatedBody;

        const { Accounts, Donor, Role, ResetPassword } = models;
        
        // Check if email exists in database and is a donor
        const account = await Accounts.findOne({ 
            where: { email: email },
            include: [
                {
                    model: Role,
                    attributes: ['name'],
                    where: { name: 'donor' },
                    required: true
                },
                {
                    model: Donor,
                    attributes: ['fullname', 'auth_provider', 'provider_id'],
                    required: false
                }
            ]
        });

        if (!account) {
            return res.json({ 
                success: false, 
                message: 'Email not found in our donor system' 
            });
        }

        // Check if account is from OAuth (not local registration)
        if (account.Donor && account.Donor.auth_provider !== 'local') {
            return res.json({ 
                success: false, 
                message: `This account was registered via ${account.Donor.auth_provider}. Password reset is not available for OAuth accounts. Please use your ${account.Donor.auth_provider} account to sign in.` 
            });
        }

        const accountData = {
            account_id: account.account_id,
            email: account.email,
            is_deactivated: account.is_deactivated,
            fullname: account.Donor?.fullname || 'User'
        }

        // Check if account is deactivated
        if (accountData.is_deactivated) {
            return res.json({ 
                success: false, 
                message: 'This account is deactivated. Please contact support.' 
            });
        }

        // Generate a unique reset token
        const resetToken = await generateUniqueCode();
        
        // Set expiration time (1 hour from now)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        // Store reset token in database
        await ResetPassword.create({
            account_id: accountData.account_id,
            reset_token: resetToken,
            expires_at: expiresAt,
            used: false,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent')
        });
        
        // Send reset email
        await sendMail(
            email,
            'Password Reset Request - UCLM CARES',
            { text: 'Please click the link to reset your password' },
            'passwordReset.html',
            {
                resetToken: resetToken,
                email: accountData.email,
                firstName: accountData.fullname || 'User',
                resetLink: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
            }
        );

        return res.json({ 
            success: true, 
            message: 'Password reset instructions have been sent to your email'
        });
    } catch (error) {
        console.error('forgotPassword controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.validatedBody;

        const { Accounts, ResetPassword, Role } = models;
        
        // Find the account and verify it's a donor
        const account = await Accounts.findOne({ 
            where: { email: email },
            include: [
                {
                    model: Role,
                    attributes: ['name'],
                    where: { name: 'donor' },
                    required: true
                }
            ]
        });
        
        if (!account) {
            return res.json({ 
                success: false, 
                message: 'Invalid reset request' 
            });
        }

        // Find the reset token
        const resetRecord = await ResetPassword.findOne({
            where: {
                account_id: account.account_id,
                reset_token: token,
                used: false
            }
        });

        if (!resetRecord) {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        // Check if token is expired
        if (new Date() > resetRecord.expires_at) {
            return res.json({ 
                success: false, 
                message: 'Reset token has expired. Please request a new one.' 
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the password
        await Accounts.update(
            { password: hashedPassword },
            { where: { account_id: account.account_id } }
        );

        // Mark the reset token as used
        await ResetPassword.update(
            { 
                used: true,
                used_at: new Date()
            },
            { where: { reset_id: resetRecord.reset_id } }
        );

        return res.json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });
    } catch (error) {
        console.error('resetPassword controller failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const oauthSuccess = async (req, res) => {
    try {
        // Minimal diagnostics to identify production failure points
        console.log('OAuth success handler entered', {
            hasUser: !!req.user,
            role: req.user?.Role?.name,
            sessionId: req.sessionID,
            isAuthenticated: typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : undefined,
            forwardedProto: req.headers['x-forwarded-proto'],
            host: req.headers['host']
        })

        if (!req.user) {
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=no_user`);
        }
        
        if (!req.user.Role || req.user.Role.name !== 'donor') {
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=bad_role`);
        }
        
        await generateToken(req.user.account_id, res);
        return res.redirect(`${FRONTEND_URL}/donor/oauth-success`);
    } catch (error) {
        console.error('OAuth success handler failed:', error.message);
        return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=exception`);
    }
}