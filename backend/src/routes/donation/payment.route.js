import express from "express"

// @ User Schema

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRoleManageEvent } from "../../static/allowedStaffRole.js"


// @ Controllers
import { donationPay, handlePaymentSuccess, getAvailablePaymentMethods, verifyPaymentCancellation } from "../../controllers/donation/payment.controller.js"

// @ Validators
import { donationPaymentSchema, paymentSuccessSchema } from "../../validators/payment.validator.js"

const paymentRouter = express.Router()

paymentRouter.get('/payment-methods', getAvailablePaymentMethods)

paymentRouter.post('/donate-now/:linkedPaymentAccountId/:event_id', guard('donor'), validateRequest(donationPaymentSchema), donationPay)

paymentRouter.post('/payment-success', validateRequest(paymentSuccessSchema), handlePaymentSuccess)

paymentRouter.get('/verify-cancellation/:donationId', verifyPaymentCancellation)

paymentRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default paymentRouter