import models from "../../models/index.js";
import { db } from "../../config/db.js";
import bcrypt from 'bcrypt'
import { sendMail } from "../../services/mailService.js";
import { generateUniqueCode } from "../../utils/generateUniqueCode.js";
import { generateToken } from "../../utils/generateToken.js";

export const signup = async (req, res) => {
    const t = await db.transaction()
    try {
        const { 
            studentId,
            email,
            password,
            confirmPassword,
            firstname,
            lastname,
            middlename,
            age,
            gender,
            phoneNumber,
            address,
            department,
            course,
            yearLevel
        } = req.validatedBody

        const picture_id_image = req.file.path

        console.log(email)

        const {
            Student,
            Accounts,
            Department,
            StudentDepartment,
            Course,
            YearLevel,
            Role,
            VerificationCodes
        } = models


        const isEmailExist = await Accounts.findOne({ where: { email: email } })
        if(isEmailExist) { return res.json({ message: 'Your email account already exist' }) }

        const truePassword = password || confirmPassword

        let salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(truePassword, salt)

        const newAccount = await Accounts.create({
            email: email,
            password: hashPassword,
            is_active: false
        }, { transaction: t })

        const newCourse = await Course.create({
            course_name: course
        }, { transaction: t })

        const newYearLevel = await YearLevel.create({
            year_level: yearLevel
        }, { transaction: t })

        const [dept] = await Department.findOrCreate({
            where: { department_name: department },
            defaults: { department_name: department },
            transaction: t
        })

        await Student.create({
            student_number: studentId,
            account_id: newAccount.account_id,
            firstname: firstname,
            lastname: lastname,
            middle_initial: middlename,
            phone_number: phoneNumber,
            current_address: address,
            age: age,
            gender: gender,
            student_image_id: picture_id_image,
            course_id: newCourse.course_id,
            department_id: dept.department_id,
            yl_id: newYearLevel.yl_id
        }, { transaction: t })

        await Role.create({
            account_id: newAccount.account_id,
            name: 'Student',
            description: 'student role allowed to be part of voluntary events'
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
        await t.rollback()
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('sign up controller failed :', error.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedBody
        console.log(email)
        console.log(password)
        const { Accounts, VerificationCodes, Role, ApprovalToken, RequestApproval } = models

        const isValid = await Accounts.findOne({ where: { email: email } })
        if(!isValid) { return res.json({ message: 'Invalid Credentials' }) }
        
        const isStudent = await Role.findOne({ where: { account_id: isValid.account_id, name: 'Student' } })

        if(!isStudent) {
            const isMatch = await bcrypt.compare(password, isValid.password)
            if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

            const requestAccount = await RequestApproval.findOne({ where: { email: isValid.email } })

            const verified = await ApprovalToken.findOne({ where: { ra_id: requestAccount.ra_id, used: true } })
            if(!verified) { return res.json({ message: 'Account is not fully verified' }) }

            await Accounts.update({ is_active: true }, { where: { account_id: isValid.account_id } })

            const role = await Role.findOne({ where: { account_id: isValid.account_id } })
            console.log(role.name)
            console.log(email)
            await generateToken(isValid.account_id, res)
            return res.json({ success: true, message: 'Login Successfully', role: role.name })
        }

        const isVerified = await VerificationCodes.findOne({ where: { account_id: isValid.account_id, used: true } })
        if(!isVerified) { return res.json({ message: 'Account is not fully verified' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if(!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

        await Accounts.update({ is_active: true }, { where: { account_id: isValid.account_id } })

        const role = await Role.findOne({ where: { account_id: isValid.account_id } })
        await generateToken(isValid.account_id, res)

        return res.json({ success: true, message: 'Login Successfully', role: role.name })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('login controller failed :', error.message)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === 'production'
        })

        return res.json({ success: true, message: 'logout successfully' })
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

        res.json({ success: true, message: 'Verification Code Accepted',  })

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
