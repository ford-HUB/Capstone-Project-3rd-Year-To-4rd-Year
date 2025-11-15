import express from "express"

// @ Donor Schema
import { donorLoginSchema, donorSignupSchema } from "../../validators/donor.validator.js"
import { forgotPasswordSchema, resetPasswordSchema } from "../../validators/forgotPassword.validator.js"
// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { loginGoogle, googleCallback, facebookLogin, facebookCallback } from "../../middleware/authentication.js"
import { guard } from "../../middleware/guard.js"
import { googleGuard } from "../../middleware/googleGuard.js"
import { oauthSessionGuard } from "../../middleware/oauthSessionGuard.js"

// @ Controllers
import { signup, login, logout, VerifyCode, reSendCode, checkAuth, checkEmailForPasswordReset, forgotPassword, resetPassword, oauthSuccess } from "../../controllers/donor/auth.controller.js"

const authDonorRouter = express.Router()

authDonorRouter.post('/donor-signup', validateRequest(donorSignupSchema), signup)
authDonorRouter.post('/donor-login', validateRequest(donorLoginSchema), login)
authDonorRouter.post('/donor-logout', guard('donor'), logout)
authDonorRouter.post('/verify-code', guard('donor'), VerifyCode) 
authDonorRouter.post('/resend-verification-code', guard('donor'), reSendCode)

// Forgot Password Routes
authDonorRouter.post('/check-email', checkEmailForPasswordReset)
authDonorRouter.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword)
authDonorRouter.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword)


// # GOOGLE AUTH
authDonorRouter.get('/google/login', loginGoogle)
authDonorRouter.get('/google/callback', googleCallback)

// # FACEBOOK AUTH
authDonorRouter.get('/facebook/login', facebookLogin)
authDonorRouter.get('/facebook/callback', facebookCallback)

// OAuth success handler - generates JWT token after OAuth
authDonorRouter.get('/oauth-success', oauthSessionGuard, oauthSuccess)


authDonorRouter.get('/protected', googleGuard('donor'), (req, res) => {
    res.send('protected is legit')
})

authDonorRouter.get('/checkAuth', guard('donor'), checkAuth)

authDonorRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default authDonorRouter