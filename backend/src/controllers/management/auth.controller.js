import models from "../../models/index.js"
import bcrypt from 'bcrypt'
import { db } from "../../config/db.js"
import { generateToken } from "../../utils/generateToken.js"
import { clearJwtCookie } from "../../utils/clearJwtCookie.js"
import { createNotification } from "../../services/notificationService.js"


export const setUpAccount = async (req, res) => {
    const { token } = req.query
    const t = await db.transaction()
    try {
        const { email, password, confirmPassword, department  } = req.validatedBody
        const { Accounts, Role, Department, Staff, Coordinator, RequestApproval, ApprovalToken } = models

        if (!token || typeof token !== 'string') {
        return res.json({ message: 'Token is required in query' });
        }

        const isTokenValid = await ApprovalToken.findOne({ where: { token: token } })

        if (!isTokenValid || isTokenValid.used) {
            return res.json({ message: 'Invalid or Already Used Token' })
        }

        const requestedInfo = await RequestApproval.findByPk(isTokenValid.ra_id)

        const isEmailExist = await Accounts.findOne({ where: { email: email } })
        if(isEmailExist) { return res.json({ message: 'Account with this email already exists.' }) }

        let truePassword = password || confirmPassword

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(truePassword, salt)

        const newAccount = await Accounts.create({
            email: email,
            password: hashPassword
        }, { transaction: t })


        if(requestedInfo.requested_role !== 'staff') {
            await Role.create({
            account_id: newAccount.account_id,
            name: requestedInfo.requested_role,
            description: 'This role allowed to manage events and certificates under the permission of admin'
            }, { transaction: t })

           const [dept] = await Department.findOrCreate({
            where: { department_name: department },
            defaults: { department_name: department },
            transaction: t
           })

           await Coordinator.create({
            account_id: newAccount.account_id,
            department_id: dept.department_id,
           }, { transaction: t })

            await ApprovalToken.update({ used: true }, { where: { token: token }, transaction: t})

           t.commit()

           return res.json({ success: true, message: 'account successfully set up' })
        }

        await Role.create({
            account_id: newAccount.account_id,
            name: requestedInfo.requested_role,
            description: 'This role allowed to manage events and certificates under the permission of admin'
        }, { transaction: t })

        await Staff.create({
            account_id: newAccount.account_id
        }, { transaction: t })

        await ApprovalToken.update({ used: true }, { where: { token: token }, transaction: t})

        t.commit()

        return res.json({ success: true, message: 'account successfully set up' })


    } catch (error) {
        t.rollback()
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('set up account failed:', error.message)
    }
}


export const login = async (req, res) => { // The login function is no longer use for now
    try {
        const { email, password } = req.validatedBody
        const { Accounts } = models

        const isValid = await Accounts.findOne({ where: { email: email } })
        if (!isValid) { return res.json({ message: 'Invalid Credentials' }) }

        const isMatch = await bcrypt.compare(password, isValid.password)
        if (!isMatch) { return res.json({ message: 'Invalid Credentials' }) }

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

        // Clear the JWT cookie
        clearJwtCookie(res);

        // Set user as inactive
        await Accounts.update({ is_active: false }, { where: { account_id: accountId } });

        return res.json({ success: true, message: 'logout successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('logout controller failed :', error.message)
    }
}


export const requestApproval = async (req, res) => {
    try {
        const { fullname, email, requested_role, reason } = req.validatedBody

        const { RequestApproval, Notification } = models

        const [newRequest, created] = await RequestApproval.findOrCreate({
            where: { email: email },
            defaults: {
                email: email,
                fullname: fullname,
                requested_role: requested_role,
                reason: reason,
                status: 'requesting'
            }
        })

        if (!created) { return res.json({ message: 'email is already requesting' }) }

        // Helper function to format role names for display
        const formatRoleName = (role) => {
            const roleMap = {
                'staff': 'Staff',
                'coordinator': 'Coordinator',
                'assistant_coordinator': 'Assistant Coordinator'
            };
            return roleMap[role] || role;
        };

        const newNotification = await createNotification({
            type: 'event_approval',
            header: 'New Request Approval',
            message: `${fullname} has requested for ${formatRoleName(requested_role)} role`,
            recipient_role: 'director',
            sender_type: 'system'
        })

        if (!newNotification) { return res.json({ message: 'Failed to create notification' }) }
        if(newRequest) {
            return res.json({ success: true, message: 'Request submitted successfully' })
        }
    } catch (error) {
        res.json({ messsage: 'Internal Server Error' })
        console.log('staff request approval controller failed: ', error.message)
    }
}


export const checkAuthenticationToken = async (req, res) => {
    try {
        const { token } = req.query
        const { ApprovalToken, RequestApproval, Role } = models

        const payload = await ApprovalToken.findOne({ where: { token: token } })
        if (!payload) { return res.json({ message: 'token not provided' }) }
        const requestedUser = await RequestApproval.findByPk(payload.ra_id)
        if (new Date() > payload.expires_at) { return res.json({ message: 'token is already expired' }) }
        return res.json({ success: true, role: requestedUser.requested_role, expiredToken: payload.expires_at, yourToken: payload.token })
    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('check authentication token Failed: ', error.message)
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.json({ success: true, user: req.user })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Check Auth controller failed :', error.message)
    }
}

