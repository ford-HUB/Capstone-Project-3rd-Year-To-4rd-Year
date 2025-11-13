import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ListApprovalRequest, ApprovedRequest, rejectRequest, ListRejectedRequests, AcceptRejectedRequest } from "../../controllers/director/manage.request.controller.js"

const manageApprovalRouter = express.Router()

manageApprovalRouter.get('/list-request-approvals', guard('director'), ListApprovalRequest)
manageApprovalRouter.put('/set-approved-request/:id', guard('director'), ApprovedRequest)
manageApprovalRouter.put('/reject-request/:id', guard('director'), rejectRequest)

// Rejected requests management
manageApprovalRouter.get('/list-rejected-requests', guard('director'), ListRejectedRequests)
manageApprovalRouter.put('/accept-rejected-request/:id', guard('director'), AcceptRejectedRequest)


manageApprovalRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default manageApprovalRouter