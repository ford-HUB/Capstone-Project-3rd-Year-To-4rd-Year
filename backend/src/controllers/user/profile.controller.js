import { db } from "../../config/db.js";
import models from "../../models/index.js";
import { sendMail } from "../../services/mailService.js";
import { generateUniqueCode } from "../../utils/generateUniqueCode.js";
import { runMatchingAI } from "../../services/matchingService.js";
import { logParticipantActivity } from "../../services/activityLogService.js";
import bcrypt from 'bcrypt'

export const currentUserProfile = async (req, res) => {
    try {
        const accountId = req.user.account_id
        const { Volunteer, CampusUsers, Department, Course, YearLevel, StrandCourse } = models

        const campusUserData = await CampusUsers.findOne({ where: { account_id: accountId } })

        if (!campusUserData) { return res.json({ message: 'Campus user profile not found' }) }

        const volunteerData = await Volunteer.findAll({
            where: { campus_user_id: campusUserData.campus_user_id },
            include: [
                { 
                    model: CampusUsers,
                    attributes: { exclude: ['gy_id'] },
                    include: [
                        { model: Department },
                        { model: Course },
                        { model: StrandCourse },
                        { model: YearLevel }
                    ]
                }
            ]
        })

        return res.json({ success: true, profileData: volunteerData })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('fetch current user profile failed', error.message)
    }
}

export const updateUserProfile = async (req, res) => {
    const t = await db.transaction()
    try {
        const { firstname, lastname, gender, middle_initial, phone_number, current_address, course, department, year_level, disability, disability_specification, is_beneficiary, is_subscribed } = req.validatedBody
        const accountId = req.user.account_id

        const { CampusUsers, Volunteer, Course, Department, YearLevel, StrandCourse } = models
        const campusUserData = await CampusUsers.findOne({ where: { account_id: accountId } })

        if(!campusUserData) { return res.json({ message: 'Campus user profile not found' }) }

        let courseUpdate = null
        if (department === 'Senior High Department') {
            courseUpdate = await StrandCourse.update(
                { name: course }, 
                { where: { strand_course_id: campusUserData.strand_course_id }, transaction: t }            )
        } else {
            courseUpdate = await Course.update(
                { course_name: course }, 
                { where: { course_id: campusUserData.course_id }, transaction: t }
            )
        }

        const [departmentUpdate] = await Department.findOrCreate({ 
            where: { department_name: department }, 
            defaults: { department_name: department }, 
            transaction: t
        })
        
        const ylUpdate = await YearLevel.update(
            { year_level: year_level }, 
            { where: { yl_id: campusUserData.yl_id }, transaction: t }
        )

        const updateCampusUserInfo = await campusUserData.update({
            firstname,
            lastname,
            gender,
            middle_initial,
            phone_number,
            current_address,
            disability,
            disability_specification,
            department_id: departmentUpdate.department_id,
            course_id: courseUpdate.course_id,
            strand_course_id: courseUpdate.strand_course_id,
            yl_id: ylUpdate.yl_id,
        }, { transaction: t })

        if(!updateCampusUserInfo) {
            await t.rollback()
            return res.json({ message: 'Failed to update profile' })
        }
        
        console.log('updateCampusUserInfo: ', updateCampusUserInfo)

        await Volunteer.update({
            is_subscribed,
            is_beneficiary: is_beneficiary || false
        }, { where: { campus_user_id: campusUserData.campus_user_id }, transaction: t })

        await t.commit()

        await logParticipantActivity(accountId, 'update', 'profile', 'Updated profile information', req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.json({ success: true, message: 'Profile updated successfully' })

    } catch (error) {
        await t.rollback()
        res.json({ success: true, message: 'Internal Server Error' })
        console.log('update profile controller failed: ', error.message)
    }
}

export const updateEmailAccount = async (req, res) => {
    try {
        const { newEmail, confirmEmail } = req.validatedBody
        const { account_id, email } = req.user

        const { Accounts, VerificationCodes } = models

        const confirmedEmail = newEmail || confirmEmail
        const isExist = await Accounts.findOne({ where: { email: confirmedEmail } })

        if(isExist) { return res.json({ message: 'This email is already associated with another account' }) }

        const emailValid = await Accounts.findOne({ where: { email } })

        if(!emailValid) { return res.json({ message: 'your account is not found' }) }
        
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) 

        const uniqueCode = await generateUniqueCode()
        const newVerficationCode = await VerificationCodes.update(
            {
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            },
            { where: { account_id: account_id } }
        )

        await sendMail(confirmedEmail, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })

        await emailValid.update({ email: confirmedEmail })

        // const newEmailUpdated = await Accounts.update({ email: confirmedEmail }, { where: { account_id: account_id } })

        // if(!newEmailUpdated) { return res.json({ message: 'new email not successfully created' }) }

        if(!newVerficationCode) { return res.json({ message: 'verification code failed to process' }) }

        await logParticipantActivity(account_id, 'update', 'account', `Updated account email to ${confirmedEmail}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.json({ success: true, message: "New OTP sent to your email", otp_expiration: FIVE_MINUTES })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('update email account failed: ', error)
    }
}

export const undoEmailChanges = async (req, res) => {
    try {
        const { account_id } = req.user

        const { Accounts, AccountUpdateLog } = models

        const accountValid = await Accounts.findByPk(account_id)
        if(!accountValid) { return res.json({ message: 'account not found' }) }

        const yourAccountLogStatus = await AccountUpdateLog.findOne({ where: { account_id: accountValid.account_id, status: 'pending' } })

        if(!yourAccountLogStatus) { return res.json({ message: 'we cannot find any last pending of your action.' }) }

        await accountValid.update({ email: yourAccountLogStatus.old_email })        

        return res.json({ success: true, message: '' })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('undo email changes')
    }
}


export const changeParticipantPassword = async (req, res) => {
    const t = await db.transaction()
    try {
        const { currentPassword, newPassword } = req.validatedBody
        const { Accounts } = models

        const accountId = req.user.account_id

        const account = await Accounts.findOne({ where: { account_id: accountId }, transaction: t })
        if(!account) {
            await t.rollback()
            return res.status(404).json({ success: false, message: 'Account not found' })
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password)
        if(!isCurrentPasswordValid) {
            await t.rollback()
            return res.status(400).json({ success: false, message: 'Current password is incorrect' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)

        await account.update({ password: hashedNewPassword }, { transaction: t })
        await t.commit()

        await logParticipantActivity(accountId, 'change', 'password', 'Successfully changed account password', req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.json({ success: true, message: 'Password changed successfully' })

    } catch (error) {
        await t.rollback()
        console.log('change participant password failed: ', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

