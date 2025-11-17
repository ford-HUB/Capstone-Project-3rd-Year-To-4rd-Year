import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export const webhookSignature = async (req, res, next) => {
    const signature = req.headers['paymongo-signature']
    
    let rawBody
    if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString('utf8')
    } else {
        rawBody = JSON.stringify(req.body)
    }

    if (!signature) {
        return res.status(401).json({ success: false, message: 'No signature provided' })
    }
    
    const isValid = verifyWebhookSignature(rawBody, signature, process.env.PAYMONGO_WEBHOOK_SECRET_KEY)
    
    if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid signature' })
    }
    
    try {
        req.body = JSON.parse(rawBody)
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid JSON payload' })
    }
    
    return next()
}

// Webhook signature verification function
function verifyWebhookSignature(rawBody, signatureHeader, secret) {
    if (!signatureHeader || !secret) {
        return false
    }
    
    const signatures = signatureHeader.split(',')
    const signatureParts = {}
    
    signatures.forEach(part => {
        const [key, value] = part.split('=')
        signatureParts[key] = value
    })

    const timestamp = signatureParts.t
    const isLiveMode = rawBody.includes('"livemode":true')
    const expectedSignature = isLiveMode ? signatureParts.li : signatureParts.te
    
    if (!timestamp || !expectedSignature) {
        return false
    }

    const signedPayload = `${timestamp}.${rawBody}`
    
    const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex')
    
    return computedSignature === expectedSignature
}