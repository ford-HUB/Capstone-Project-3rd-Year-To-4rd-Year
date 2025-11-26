import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { generateUniqueCode } from "../../utils/generateUniqueCode.js"
import { generateToken } from "../../utils/generateToken.js"
import { clearJwtCookie } from "../../utils/clearJwtCookie.js"
import { decrypt } from "../../utils/crypto.js"
import { sendMail } from "../../services/mailService.js"
import { logDonorActivity } from "../../services/activityLogService.js";
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
            await t.rollback()
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

        // Generate verification code
        const uniqueCode = await generateUniqueCode()
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expiration to 5 minutes
        
        await VerificationCodes.create({
            account_id: newAccount.account_id,
            code: uniqueCode,
            expires_at: FIVE_MINUTES, 
            used: false
        }, { transaction: t })
        
        await sendMail(email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })
        
        await generateToken(newAccount.account_id, res)
        
        await t.commit()
        
        res.json({ success: true, message: "Account Successfully Registered", otp_expiration: FIVE_MINUTES })


    } catch (error) {
        await t.rollback()
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

        await logDonorActivity(accountId, 'access', 'account', 'Successfully logged out from the system', req.ip || req.connection.remoteAddress, req.get('user-agent'));

        await Accounts.update({ is_active: false }, { where: { account_id: accountId } });

        req.logout(() => {
            req.session.destroy(() => {
                res.clearCookie('connect.sid', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                    path: '/'
                });
                clearJwtCookie(res);

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
        const { rq_access } = req.query
        const { VerificationCodes, Accounts } = models

        if (!rq_access) {
            return res.json({ message: 'rq_access parameter is required' })
        }

        // Decrypt rq_access to get the email
        let decrypted_data;
        try {
            decrypted_data = decrypt(rq_access);
            
            // Check if decryption was successful
            if (!decrypted_data) {
                return res.json({ message: 'Invalid verification link. Please request a new verification email.' })
            }
        } catch (decryptError) {
            console.error('Decryption error:', decryptError.message);
            return res.status(500).json({ message: 'Server configuration error: CRYPTO_SECRET_KEY is not set' })
        }

        const user = await Accounts.findOne({ where: { email: decrypted_data } })
        if (!user) { return res.json({ message: 'User not found' }) }

        const isMatch = await VerificationCodes.findOne({ where: { account_id: user.account_id, code: code } })
        if(!isMatch) { return res.json({ message: 'Verification Code Does not Match' }) }

        if(isMatch.used) { return res.json({ message: 'Verification Code Already Used, Please attempt resend code' }) }

        const now = Date.now()
        const expiresAt = new Date(isMatch.expires_at)
        if(now > expiresAt) { return res.json({ message: 'Verification Code is Expired' }) }

        const updateStatus = await VerificationCodes.update({ used: true }, { where: { vc_id: isMatch.vc_id } })
        if(!updateStatus) { return res.json({ message: 'verification code is not successfully updated the status' }) }

        // Activate the account after successful verification
        await Accounts.update({ is_active: true }, { where: { account_id: user.account_id } });

        res.json({ success: true, message: 'Verification Code Accepted - Account Activated!' })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('VerifyCode controller failed :', error.message)
    }
}


export const reSendCode = async (req, res) => {
    try {
        const { rq_access } = req.query
        const { VerificationCodes, Accounts } = models

        if (!rq_access) {
            return res.json({ success: false, message: 'rq_access parameter is required' })
        }
        
        // Decrypt rq_access to get the email
        let decrypted_data;
        try {
            decrypted_data = decrypt(rq_access);
            
            // Check if decryption was successful
            if (!decrypted_data) {
                return res.json({ success: false, message: 'Invalid verification link. Please request a new verification email.' })
            }
        } catch (decryptError) {
            console.error('Decryption error:', decryptError.message);
            return res.status(500).json({ success: false, message: 'Server configuration error: CRYPTO_SECRET_KEY is not set' })
        }

        const user = await Accounts.findOne({ where: { email: decrypted_data } })
        if(!user) { return res.json({ success: false, message: 'User not found' }) }

        const uniqueCode = await generateUniqueCode()
        await sendMail(user.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })

        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expiration to 5 minutes

        await VerificationCodes.update({
            account_id: user.account_id,
            code: uniqueCode,
            expires_at: FIVE_MINUTES,
            used: false
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
        console.log('checkAuth called:', {
            hasUser: !!req.user,
            userId: req.user?.account_id,
            email: req.user?.email,
            role: req.user?.Role?.name
        });
        
        if (!req.user) {
            console.error('checkAuth: No user found - authentication failed');
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
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
        console.log('OAuth success handler called', {
            hasUser: !!req.user,
            userId: req.user?.account_id,
            email: req.user?.email,
            role: req.user?.Role?.name
        });
        
        // Validate user exists and has correct role
        if (!req.user) {
            console.error('OAuth success: No user in session');
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=no_user`);
        }
        
        if (!req.user.Role || req.user.Role.name !== 'donor') {
            console.error('OAuth success: Invalid role', { 
                account_id: req.user.account_id,
                email: req.user.email,
                role: req.user.Role?.name 
            });
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=bad_role`);
        }
        
        // Set user as active
        const { Accounts } = models;
        await Accounts.update({ is_active: true }, { where: { account_id: req.user.account_id } });
        
        // Clear existing JWT cookies to avoid stale tokens
        clearJwtCookie(res);
        
        // Save account_id before destroying session
        const accountId = req.user.account_id;
        
        // Generate JWT token (sets httpOnly cookie and returns token for client storage)
        let token;
        try {
            token = await generateToken(accountId, res);
            console.log('OAuth success: JWT token generated and cookie set for account_id:', accountId);
        } catch (tokenError) {
            console.error('Failed to generate token during OAuth:', {
                error: tokenError.message,
                stack: tokenError.stack,
                account_id: accountId
            });
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=token_generation_failed`);
        }
        
        // Destroy session after successful OAuth (we're using JWT now)
        req.logout((err) => {
            if (err) {
                console.error('Error during logout after OAuth:', err);
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error('Error destroying session after OAuth:', destroyErr);
                }
                // Clear session cookie
                res.clearCookie('connect.sid', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    path: '/'
                });
                
                console.log('OAuth success: Redirecting to frontend with token', { account_id: accountId });
                // Redirect to frontend OAuth success page with token in URL hash (more secure than query param)
                return res.redirect(`${FRONTEND_URL}/donor/oauth-success#token=${encodeURIComponent(token)}`);
            });
        });
    } catch (error) {
        console.error('OAuth success handler failed:', {
            message: error.message,
            stack: error.stack,
            hasUser: !!req.user,
            userId: req.user?.account_id
        });
        return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=exception`);
    }
}