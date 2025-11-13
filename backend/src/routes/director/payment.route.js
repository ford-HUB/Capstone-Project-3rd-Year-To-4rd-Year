import express from "express"

// @ Schema
import { createPaymentLinkSchema, updatePaymentStatusSchema } from "../../validators/payment.validator.js"

// @ Middleware
import { guard } from "../../middleware/guard.js"
import { validateRequest } from "../../middleware/validateRequest.middleware.js"

// @ Controllers
import { connectDirectorPayment, getPaymentMethods, updatePaymentStatus, removePaymentMethod, updatePaymentMethod } from "../../controllers/director/payment.controller.js"

const paymentDirectorRouter = express.Router()

paymentDirectorRouter.post('/create-payment-link', guard('director'), validateRequest(createPaymentLinkSchema), connectDirectorPayment)
paymentDirectorRouter.get('/get-all-payment-links', guard('director'), getPaymentMethods)
paymentDirectorRouter.put('/update-status/:paymentId', guard('director'), validateRequest(updatePaymentStatusSchema), updatePaymentStatus)
paymentDirectorRouter.delete('/remove/:paymentId', guard('director'), removePaymentMethod)
paymentDirectorRouter.post('/update-payment-method', guard('director'), validateRequest(createPaymentLinkSchema), updatePaymentMethod)

paymentDirectorRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default paymentDirectorRouter