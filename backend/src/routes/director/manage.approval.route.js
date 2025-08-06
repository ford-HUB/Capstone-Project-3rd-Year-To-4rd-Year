import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ListApprovalRequest, ApprovedRequest, deleteRequest } from "../../controllers/director/manage.request.controller.js"

const manageApprovalRouter = express.Router()

manageApprovalRouter.get('/list-request-approvals', guard('director'), ListApprovalRequest)
manageApprovalRouter.put('/set-approved-request/:id', guard('director'), ApprovedRequest)
manageApprovalRouter.delete('/delete-request/:id', guard('director'), deleteRequest)


manageApprovalRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default manageApprovalRouter