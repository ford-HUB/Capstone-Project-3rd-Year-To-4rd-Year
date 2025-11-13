import express from "express"

// @ Middleware
import { webhookSignature } from "../../../middleware/webhookSignature.js"

// @ Controllers
import { webhookPayment } from "../../../controllers/webhook/payment/payment.controller.js"

const webhookPaymentRouter = express.Router()

// ✅ USE RAW BODY for webhook routes - CRITICAL for signature verification
webhookPaymentRouter.post('/donate', 
  express.raw({ type: 'application/json' }), // Raw body for signature verification
  webhookSignature, 
  webhookPayment
)

// Test endpoint for webhook health check
webhookPaymentRouter.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Webhook endpoint is working' })
})


export default webhookPaymentRouter