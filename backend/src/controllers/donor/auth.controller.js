import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { generateUniqueCode } from "../../utils/generateUniqueCode.js"
import { generateToken } from "../../utils/generateToken.js"
import { clearJwtCookie } from "../../utils/clearJwtCookie.js"
import { decryptRqAccess } from "../../utils/crypto.js"
import { sendMail } from "../../services/mailService.js"
import { logDonorActivity } from "../../services/activityLogService.js";
import { emitUserActivityUpdate } from "../../socket.js";
import bcrypt from 'bcrypt'

const FRONTEND_URL = process.env.NODE_ENV === 'development'
    ? process.env.FRONT_END_URL
    : process.env.FRONTEND_URL_PROD

export const signup = async (req, res) => {
    const t = await db.transaction();

    try {
        const { fullname, email, password, confirmPassword } = req.validatedBody;
        const { Accounts, VerificationCodes, Role, Donor } = models;

        const existingAccount = await Accounts.findOne({ where: { email } });
        let accountToUse = existingAccount;
        let isNewAccount = false;
        let existingVerificationCode = null;

        if (existingAccount) {
            if (existingAccount.is_active) {
                await t.rollback();
                return res.json({ message: 'Your email account already exists and is verified' });
            }

            existingVerificationCode = await VerificationCodes.findOne({
                where: { account_id: existingAccount.account_id },
                order: [['createdAt', 'DESC']]
            });

            if (existingVerificationCode && existingVerificationCode.used) {
                await t.rollback();
                return res.json({ message: 'Your email account already exists. Please contact support if you need assistance.' });
            }

            const now = new Date();
            const isCodeExpired = existingVerificationCode && now > existingVerificationCode.expires_at;
            const canReuse = !existingVerificationCode || (existingVerificationCode && !existingVerificationCode.used && isCodeExpired);

            if (canReuse) {
                accountToUse = existingAccount;
                isNewAccount = false;
            } else if (existingVerificationCode && !existingVerificationCode.used && !isCodeExpired) {
                await t.rollback();
                return res.status(400).json({ message: 'A verification code has already been sent. Please check your email or wait for it to expire.' });
            }
        } else {
            isNewAccount = true;
        }

        const truePassword = password || confirmPassword;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(truePassword, salt);

        let accountToUpdate;
        if (isNewAccount) {
            accountToUpdate = await Accounts.create({
                email,
                password: hashPassword,
                is_active: false
            }, { transaction: t });
        } else {
            await Accounts.update(
                { password: hashPassword, is_active: false },
                { where: { account_id: accountToUse.account_id }, transaction: t }
            );
            accountToUpdate = accountToUse;
        }

        const existingRole = await Role.findOne({ where: { account_id: accountToUpdate.account_id } });
        if (existingRole) {
            await existingRole.update({
                name: 'donor',
                description: 'this role allowed to donate'
            }, { transaction: t });
        } else {
            await Role.create({
                account_id: accountToUpdate.account_id,
                name: 'donor',
                description: 'this role allowed to donate'
            }, { transaction: t });
        }

        const existingDonor = await Donor.findOne({ where: { account_id: accountToUpdate.account_id } });
        if (existingDonor) {
            await existingDonor.update({
                provider_id: accountToUpdate.account_id.toString(),
                auth_provider: 'local',
                fullname: fullname,
                is_verified: false
            }, { transaction: t });
        } else {
            await Donor.create({
                account_id: accountToUpdate.account_id,
                provider_id: accountToUpdate.account_id.toString(),
                auth_provider: 'local',
                fullname: fullname,
                is_verified: false
            }, { transaction: t });
        }

        const uniqueCode = await generateUniqueCode();
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000);

        if (existingVerificationCode && !existingVerificationCode.used) {
            await VerificationCodes.update({
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            }, { where: { vc_id: existingVerificationCode.vc_id }, transaction: t });
        } else {
            await VerificationCodes.create({
                account_id: accountToUpdate.account_id,
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            }, { transaction: t });
        }

        await sendMail(email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { 
            email: process.env.AUTH_MAILER, 
            code: uniqueCode, 
            company_name: 'uclmcares' 
        });

        await generateToken(accountToUpdate.account_id, res);

        await t.commit();

        res.json({ 
            success: true, 
            message: isNewAccount ? 'Account Successfully Registered! Please verify your email.' : 'Registration updated! A new verification code has been sent to your email.', 
            otp_expiration: FIVE_MINUTES,
            user: {
                account_id: accountToUpdate.account_id,
                email: accountToUpdate.email,
                is_active: accountToUpdate.is_active
            }
        });

    } catch (error) {
        await t.rollback();
        console.error('signup donor failed:', error.message);
        res.json({ message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedBody

        const { Accounts, VerificationCodes } = models

        const isValid = await Accounts.findOne({ where: { email: email } })
        if(!isValid) { return res.json({ success: false, message: 'Invalid Credentials' }) }
        
        const isVerified = await VerificationCodes.findOne({ where: { account_id: isValid.account_id } })
        if(!isVerified || !isVerified.used) { return res.json({ success: false, message: 'Account Not Verified' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if(!isMatch) { return res.json({ success: false, message: 'Invalid Credentials' }) }

        await Accounts.update({ is_active: true, activeAt: new Date() }, { where: { account_id: isValid.account_id } })
        await generateToken(isValid.account_id, res)

        await logDonorActivity(
            isValid.account_id,
            'access',
            'account',
            'Successfully logged in to the system',
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        try {
            emitUserActivityUpdate(isValid.account_id, "online", {
                email: isValid.email,
                role: 'donor',
                loginTime: new Date()
            });
        } catch (socketError) {
            console.log('Socket emit failed:', socketError.message);
        }

        res.json({ success: true, message: 'Login Successfully', userId: isValid.account_id })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' })
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
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        console.error('logout controller failed :', error.message);
    }
}

export const VerifyCode = async (req, res) => {
    try {
        const { code } = req.body
        const { rq_access } = req.query
        const { VerificationCodes, Accounts } = models

        if (!rq_access) {
            return res.json({ success: false, message: 'rq_access parameter is required' })
        }

        const decryptResult = decryptRqAccess(rq_access);
        if (decryptResult.error) {
            return res.status(decryptResult.error.includes('Server configuration') ? 500 : 400)
                .json({ success: false, message: decryptResult.error })
        }

        const user = await Accounts.findOne({ where: { email: decryptResult.data } })
        if (!user) { return res.json({ success: false, message: 'User not found' }) }

        const isMatch = await VerificationCodes.findOne({ where: { account_id: user.account_id, code: code } })
        if(!isMatch) { return res.json({ success: false, message: 'Verification Code Does not Match' }) }

        if(isMatch.used) { return res.json({ success: false, message: 'Verification Code Already Used, Please attempt resend code' }) }

        const now = new Date()
        const expiresAt = new Date(isMatch.expires_at)
        if(now > expiresAt) { return res.json({ success: false, message: 'Verification Code is Expired' }) }

        const updateStatus = await VerificationCodes.update({ used: true }, { where: { vc_id: isMatch.vc_id } })
        if(updateStatus[0] === 0) { return res.json({ success: false, message: 'verification code is not successfully updated the status' }) }

        await Accounts.update({ is_active: true }, { where: { account_id: user.account_id } });

        res.json({ success: true, message: 'Verification Code Accepted - Account Activated!' })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' })
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
        
        const decryptResult = decryptRqAccess(rq_access);
        if (decryptResult.error) {
            return res.status(decryptResult.error.includes('Server configuration') ? 500 : 400)
                .json({ success: false, message: decryptResult.error })
        }

        const user = await Accounts.findOne({ where: { email: decryptResult.data } })
        if(!user) { return res.json({ success: false, message: 'User not found' }) }

        const uniqueCode = await generateUniqueCode()
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000)

        await sendMail(user.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { 
            email: process.env.AUTH_MAILER, 
            code: uniqueCode, 
            company_name: 'uclmcares' 
        })

        const existingVerificationCode = await VerificationCodes.findOne({
            where: { account_id: user.account_id },
            order: [['createdAt', 'DESC']]
        })

        if (existingVerificationCode && !existingVerificationCode.used) {
            await VerificationCodes.update({
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            }, { 
                where: { vc_id: existingVerificationCode.vc_id }
            })
        } else {
            await VerificationCodes.create({
                account_id: user.account_id,
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            })
        }

        res.json({ success: true, message: "New OTP sent to your email", otp_expiration: FIVE_MINUTES })
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' })
        console.error('Resend Code controller failed :', error.message)
    }
}

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
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

        if (accountData.is_deactivated) {
            return res.json({ 
                success: false, 
                message: 'This account is deactivated. Please contact support.' 
            });
        }

        const resetToken = await generateUniqueCode();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        
        await ResetPassword.create({
            account_id: accountData.account_id,
            reset_token: resetToken,
            expires_at: expiresAt,
            used: false,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('User-Agent')
        });
        
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

        if (new Date() > resetRecord.expires_at) {
            return res.json({ 
                success: false, 
                message: 'Reset token has expired. Please request a new one.' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await Accounts.update(
            { password: hashedPassword },
            { where: { account_id: account.account_id } }
        );

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
        if (!req.user) {
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=no_user`);
        }
        
        if (!req.user.Role || req.user.Role.name !== 'donor') {
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=bad_role`);
        }
        
        const { Accounts } = models;
        await Accounts.update({ is_active: true, activeAt: new Date() }, { where: { account_id: req.user.account_id } });
        clearJwtCookie(res);
        const accountId = req.user.account_id;
        
        let token;
        try {
            token = await generateToken(accountId, res);
        } catch (tokenError) {
            console.error('Failed to generate token during OAuth:', tokenError.message);
            return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=token_generation_failed`);
        }
        
        try {
            await logDonorActivity(
                accountId,
                'access',
                'account',
                'Successfully logged in to the system via OAuth',
                req.ip || req.connection.remoteAddress,
                req.get('user-agent')
            );
        } catch (logError) {
            console.error('Activity log failed during OAuth login (non-critical):', logError.message);
        }

        try {
            emitUserActivityUpdate(accountId, "online", {
                email: req.user.email,
                role: 'donor',
                loginTime: new Date()
            });
        } catch (socketError) {
            console.log('Socket emit failed during OAuth login:', socketError.message);
        }

        req.logout((err) => {
            if (err) {
                console.error('Error during logout after OAuth:', err);
            }
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error('Error destroying session after OAuth:', destroyErr);
                }
                res.clearCookie('connect.sid', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    path: '/'
                });
                return res.redirect(`${FRONTEND_URL}/donor/oauth-success#token=${encodeURIComponent(token)}`);
            });
        });
    } catch (error) {
        console.error('OAuth success handler failed:', error.message);
        return res.redirect(`${FRONTEND_URL}/donor/login?error=oauth_failed&reason=exception`);
    }
}