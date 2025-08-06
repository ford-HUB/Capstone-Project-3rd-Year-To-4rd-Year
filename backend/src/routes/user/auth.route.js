import express from "express"

// @ User Schema
import { signupSchema, loginSchema } from "../../validators/user.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { upload } from "../../middleware/cloudinaryUpload.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRole } from "../../static/allowedStaffRole.js"

// @ Controllers
import { signup, login, logout, VerifyCode, checkAuth, reSendCode } from "../../controllers/user/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/user-signup', upload.single('studentIdFile'), validateRequest(signupSchema), signup)
authRouter.post('/user-login', validateRequest(loginSchema), login)
authRouter.post('/user-logout', logout)


authRouter.post('/verify-code', guard(...allowedRole), VerifyCode)
authRouter.post('/resend-verification-code', guard(...allowedRole), reSendCode)

authRouter.get('/checkAuth', guard('Student'), checkAuth)





authRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default authRouter