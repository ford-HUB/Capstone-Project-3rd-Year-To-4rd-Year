import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { generateUniqueCode } from "../../utils/generateUniqueCode.js"
import { generateToken } from "../../utils/generateToken.js"
import { sendMail } from "../../services/mailService.js"
import bcrypt from 'bcrypt'

export const signup = async (req, res) => {
    const t = await db.transaction()
    try {
        const { email, password, confirmPassword } = req.validatedBody

        console.log(email)

        const { Accounts, VerificationCodes, Role } = models

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
            name: 'Donor',
            description: 'this role allowed to donate'
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
        if(!isVerified.used) { return res.json({ message: 'Account Not Verified' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

        await generateToken(isValid.account_id, res)

        res.json({ success: true, message: 'Login Successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}

export const logout = async (req, res) => {
    try {
        req.logout(() => {
            req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: true,
                secure: process.env.NODE_ENV === 'production'
            })

            res.json({ success: true, message: 'Logout successful' })
            })
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('logout controller failed :', error.message)
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
        await t.rollback()
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Check Auth controller failed :', error.message)
    }
}
