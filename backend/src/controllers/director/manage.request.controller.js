import models from "../../models/index.js"
import { sendMail } from "../../services/mailService.js";
import { generateUniqueToken } from "../../utils/generatePermessionToken.js";

export const ListApprovalRequest = async (req, res) => {
    try {
        const { RequestApproval } = models

        const getList = await RequestApproval.findAll({ where: { status: 'requesting' }});

        if(getList.length === 0) { return res.json({ message: 'Request Approvals Currently Empty' }) }

        res.json({ success: true, list: getList })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('List Approval Request Failed: ', error.message)
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

        await sendMail(requestedStaff.email, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingRequestApproval.html', { email: process.env.AUTH_MAILER, token: uniqueToken } )

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

export const deleteRequest = async (req, res) => {
    try {
        const id = req.params.id

        const { RequestApproval } = models

        const isExist = await RequestApproval.findOne({ where: { ra_id: id } })

        if(!isExist) { return res.json({ message: 'requested id not found' }) }

        await RequestApproval.destroy({ where: { ra_id: isExist.ra_id } })
        
        res.json({ success: true, message: 'Account Successfully Deleted' })
    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('Delete Approval Request Failed: ', error.message)
    }
}


