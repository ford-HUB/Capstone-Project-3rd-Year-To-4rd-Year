import express from "express"

// @ Donor Schema
import { donorLoginSchema, donorSignupSchema } from "../../validators/donor.validator.js"
// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { loginGoogle, googleCallback, facebookLogin, facebookCallback } from "../../middleware/authentication.js"
import { guard } from "../../middleware/guard.js"
import { googleGuard } from "../../middleware/googleGuard.js"

// @ Controllers
import { signup, login, logout, VerifyCode, reSendCode, checkAuth } from "../../controllers/donor/auth.controller.js"

const authDonorRouter = express.Router()

authDonorRouter.post('/donor-signup', validateRequest(donorSignupSchema), signup)
authDonorRouter.post('/donor-login', validateRequest(donorLoginSchema), login)
authDonorRouter.post('/donor-logout', logout)
authDonorRouter.post('/verify-code', guard('Donor'), VerifyCode) 
authDonorRouter.post('/resend-verification-code', guard('Donor'), reSendCode)


// # GOOGLE AUTH 
authDonorRouter.get('/google/login', loginGoogle)
authDonorRouter.get('/google/callback', googleCallback)

// # FACEBOOK AUTH
authDonorRouter.get('/facebook/login', facebookLogin)
authDonorRouter.get('/facebook/callback', facebookCallback)


authDonorRouter.get('/protected', googleGuard('Donor'), (req, res) => {
    res.send('protected is legit')
})

authDonorRouter.get('/checkAuth', guard('Donor'), checkAuth)

authDonorRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default authDonorRouter