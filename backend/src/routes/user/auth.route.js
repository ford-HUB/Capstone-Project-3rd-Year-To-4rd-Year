import express from "express"

// @ User Schema
import { signupSchema, loginSchema } from "../../validators/user.validator.js"
import { forgotPasswordSchema, resetPasswordSchema } from "../../validators/forgotPassword.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { upload } from "../../middleware/cloudinaryUpload.js"
import { guard } from "../../middleware/guard.js"


// @ Controllers
import { signup, login, logout, VerifyCode, checkAuth, reSendCode, checkEmailExists, forgotPassword, resetPassword } from "../../controllers/user/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/user-signup', upload.single('studentIdFile'), validateRequest(signupSchema), signup)
authRouter.post('/user-login', validateRequest(loginSchema), login)
authRouter.post('/logout', guard('volunteer', 'beneficiary', 'donor'), logout)
authRouter.post('/check-email', checkEmailExists)
authRouter.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword)
authRouter.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword)


authRouter.post('/verify-code', guard('volunteer', 'donor', 'beneficiary'), VerifyCode)
authRouter.post('/resend-verification-code', guard('volunteer', 'donor', 'beneficiary'), reSendCode)

authRouter.get('/checkAuth', guard('volunteer', 'beneficiary', 'donor'), checkAuth)





authRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default authRouter