import express from "express"

// @ User Schema
import { loginSchema } from "../../validators/director.validator.js"
// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import limiter from "../../middleware/rateLimiter.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { login, logout, check_auth_director } from "../../controllers/director/auth.controller.js"

const authDirectorRouter = express.Router()

authDirectorRouter.post('/uclm-director-login', validateRequest(loginSchema), limiter, login )
authDirectorRouter.post('/uclm-director-logout', logout)
authDirectorRouter.get('/check-director-auth', guard('director'), check_auth_director)

authDirectorRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default authDirectorRouter