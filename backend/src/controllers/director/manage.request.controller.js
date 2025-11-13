import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { sendMail } from "../../services/mailService.js";
import { generateUniqueToken } from "../../utils/generatePermessionToken.js";
import { removeNotification } from "../../socket.js";

export const ListApprovalRequest = async (req, res) => {
    try {
        const { RequestApproval } = models

        const getList = await RequestApproval.findAll({ where: { status: 'requesting' }});

        if(getList.length === 0) { return res.json({ message: 'Request Approvals Currently Empty' }) }

        // Debug: Log the structure of the first item
        if(getList.length > 0) {
            console.log('First request item structure:', JSON.stringify(getList[0].dataValues, null, 2));
        }

        res.json({ success: true, list: getList })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('List Approval Request Failed: ', error.message)
    }
}

export const ListRejectedRequests = async (req, res) => {
    try {
        const { RequestApproval } = models

        const getList = await RequestApproval.findAll({ 
            where: { status: 'rejected' },
            order: [['updatedAt', 'DESC']]
        });

        if(getList.length === 0) { return res.json({ message: 'Rejected Requests Currently Empty' }) }

        // Debug: Log the structure of the first item
        if(getList.length > 0) {
            console.log('First rejected request item structure:', JSON.stringify(getList[0].dataValues, null, 2));
        }

        res.json({ success: true, list: getList })

    } catch (error) {
        console.log('List Rejected Requests Failed: ', error.message)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const ApprovedRequest = async (req, res) => {
    try {
        const id = req.params.id

        const { RequestApproval, ApprovalToken } = models

        const requestedStaff = await RequestApproval.findOne({ where: { ra_id: id } })
        if(!requestedStaff) { return res.json({ message: 'requested staff not found' }) }

        if(requestedStaff.status === 'approved') { return res.json({ message: 'requested email is already approved' }) }

        const updateRequest = await RequestApproval.update(
            { status: "approved" },
            { where: { ra_id: requestedStaff.ra_id } }
        )

        if(!updateRequest) { return res.json({ message: 'status not successfully updated' }) }

        const uniqueToken = await generateUniqueToken()

        const FRONTEND_URL = process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD
        await sendMail(requestedStaff.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingRequestApproval.html', { email: process.env.AUTH_MAILER, token: uniqueToken, setup_link: `${FRONTEND_URL}/requested-setup-account?token=${uniqueToken}` } )

        // Send approval notification email
        try {
            await notifyRequestAction(requestedStaff.email, 'APPROVED', {
                fullname: requestedStaff.fullname,
                requested_role: requestedStaff.requested_role
            })
        } catch (err) {
            console.log('Approval email failed:', err.message)
        }

        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) // this will set expireration to 5 minutes


        await ApprovalToken.create({
            ra_id: requestedStaff.ra_id,
            token: uniqueToken,
            expires_at: FIVE_MINUTES,
            used: false
        })

        res.json({ success: true, message: 'status successfully updated' })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('Set Approval Request Failed: ', error.message)
    }
}

export const rejectRequest = async (req, res) => {
    const t = await db.transaction()
    try {
        const id = req.params.id
        const { reason } = req.body || {}

        const { RequestApproval, Notification } = models

        const isExist = await RequestApproval.findByPk(id)

        if(!isExist) { 
            await t.rollback()
            return res.json({ success: false, message: 'requested id not found' }) 
        }

        // Update status to rejected with reason
        await RequestApproval.update(
            { 
                status: 'rejected',
                rejection_reason: reason || 'No reason provided'
            },
            { where: { ra_id: id }, transaction: t }
        )

        // Remove notification
        await Notification.destroy({ 
            where: { 
                sender_type: 'system',
                recipient_role: 'director',
                header: 'New Request Approval',
                message: `${isExist.fullname} has requested for ${formatRoleName(isExist.requested_role)} role`
            }, 
            transaction: t 
        })

        // Send rejection email
        try {
            await notifyRequestAction(isExist.email, 'REJECTED', {
                fullname: isExist.fullname,
                requested_role: isExist.requested_role,
                reason: reason || 'No reason provided'
            })
        } catch (err) {
            console.log('Rejection email failed:', err.message)
        }

        // Note: Notification removal from frontend state is handled by the database removal above

        await t.commit()
        return res.json({ success: true, message: 'Request successfully rejected' })
    } catch (error) {
        await t.rollback()
        console.log('Reject Approval Request Failed: ', error.message)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

// Helper function to format role names for display
const formatRoleName = (role) => {
    const roleMap = {
        'staff': 'Staff',
        'coordinator': 'Coordinator',
        'assistant_coordinator': 'Assistant Coordinator'
    };
    return roleMap[role] || role;
};

// DRY helper: notify request actions
const notifyRequestAction = async (email, action, data) => {
    const actionConfig = {
        'APPROVED': {
            subject: 'Your role request has been approved',
            title: 'Request Approved',
            description: `Congratulations! Your request for ${formatRoleName(data.requested_role)} role has been approved.`,
            status_title: 'Request Status: Approved',
            status_description: 'You will receive a separate email with instructions to complete your account setup.',
            action_title: 'Next steps:',
            action_text: 'Please check your email for the verification link to complete your account setup. The link will expire in 5 minutes.'
        },
        'REJECTED': {
            subject: 'Your role request has been declined',
            title: 'Request Declined',
            description: `We regret to inform you that your request for ${formatRoleName(data.requested_role)} role has been declined.`,
            status_title: 'Request Status: Declined',
            status_description: 'Your request has been reviewed and unfortunately cannot be approved at this time.',
            action_title: 'Reason for decline:',
            action_text: data.reason || 'No specific reason provided'
        }
    }

    const config = actionConfig[action] || actionConfig['REJECTED']
    const template = 'accountActionNotification.html'
    
    const variables = {
        email: process.env.AUTH_MAILER,
        title: config.title,
        description: config.description,
        status_title: config.status_title,
        status_description: config.status_description,
        reason: data.reason || 'No specific reason provided',
        action_title: config.action_title,
        action_text: config.action_text
    }
    
    await sendMail(email, config.subject, config.description, template, variables)
}

export const AcceptRejectedRequest = async (req, res) => {
    try {
        const id = req.params.id

        const { RequestApproval, ApprovalToken } = models

        const rejectedRequest = await RequestApproval.findOne({ where: { ra_id: id, status: 'rejected' } })
        if(!rejectedRequest) { return res.json({ success: false, message: 'rejected request not found' }) }

        // Update status to approved
        await RequestApproval.update(
            { status: "approved" },
            { where: { ra_id: rejectedRequest.ra_id } }
        )

        const uniqueToken = await generateUniqueToken()

        // Send verification email
        const FRONTEND_URL = process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD
        await sendMail(rejectedRequest.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingRequestApproval.html', { email: process.env.AUTH_MAILER, token: uniqueToken, setup_link: `${FRONTEND_URL}/requested-setup-account?token=${uniqueToken}` } )

        // Send approval notification email
        try {
            await notifyRequestAction(rejectedRequest.email, 'APPROVED', {
                fullname: rejectedRequest.fullname,
                requested_role: rejectedRequest.requested_role
            })
        } catch (err) {
            console.log('Approval email failed:', err.message)
        }

        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000)

        await ApprovalToken.create({
            ra_id: rejectedRequest.ra_id,
            token: uniqueToken,
            expires_at: FIVE_MINUTES,
            used: false
        })

        res.json({ success: true, message: 'Rejected request successfully approved' })

    } catch (error) {
        console.log('Accept Rejected Request Failed: ', error.message)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}


