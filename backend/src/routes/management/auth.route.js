import express from "express"

// @ User Schema
import { requestApprovalSchema, loginSchema, setUpAccountSchema } from "../../validators/management.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { requestApproval, login, logout, checkAuth, checkAuthenticationToken, setUpAccount } from "../../controllers/management/auth.controller.js"

const managementRouter = express.Router()

managementRouter.post('/set-up-account', validateRequest(setUpAccountSchema), setUpAccount)
managementRouter.post('/request-approval', validateRequest(requestApprovalSchema), requestApproval)
managementRouter.post('/management-login', validateRequest(loginSchema), login)
managementRouter.post('/management-logout', guard('staff', 'coordinator', 'assistant_coordinator'), logout)
managementRouter.get('/check-auth-management', guard('staff', 'coordinator', 'assistant_coordinator'), checkAuth)
managementRouter.get('/check-authenticated-token', checkAuthenticationToken)


managementRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default managementRouter