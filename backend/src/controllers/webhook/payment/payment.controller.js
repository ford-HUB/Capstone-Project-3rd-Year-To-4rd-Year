import models from "../../../models/index.js";
import { emitDonationUpdate } from "../../../socket.js";
import { db } from "../../../config/db.js";

export const webhookPayment = async (req, res) => {
    const t = await db.transaction()
    try {
        // Body is already parsed by the middleware
        const webhookData = req.body

        const { PaymentMethod, Payments, Donations } = models

        // Check if webhook data is valid
        if (!webhookData || typeof webhookData !== 'object') {
            return res.json({ success: false, message: 'Invalid webhook data' })
        }

        // Extract event type and data from the nested structure
        const eventData = webhookData.data
        if (!eventData || !eventData.attributes) {
            return res.json({ success: false, message: 'Invalid webhook data structure' })
        }

        const type = eventData.attributes.type
        const data = eventData.attributes.data

        if (!type) {
            return res.json({ success: false, message: 'No event type found' })
        }

        if (type === 'checkout_session.payment.paid' || type === 'payment.paid') {
            let checkoutSessionId = null
            let paymentData = null

            if (type === 'checkout_session.payment.paid') {
                const checkoutSession = data
                checkoutSessionId = checkoutSession.id
            } else if (type === 'payment.paid') {
                paymentData = data
            }

            // Find the payment method by checkout session ID or payment ID
            let paymentMethod = null
            if (checkoutSessionId) {
                paymentMethod = await PaymentMethod.findOne({
                    where: { external_reference: checkoutSessionId }
                })
            } else if (paymentData) {
                // Try to find by payment ID in metadata
                const metadata = paymentData.attributes?.metadata
                if (metadata && metadata.donation_id) {
                    paymentMethod = await PaymentMethod.findOne({
                        where: { donation_id: metadata.donation_id }
                    })
                }
            }

            if (!paymentMethod) {
                return res.json({ success: false, message: 'Payment method not found' })
            }

            // Update payment method status
            await paymentMethod.update({
                payment_status: 'PAID',
                paid_at: new Date(),
            })

            const transactionId = checkoutSessionId || paymentData?.id

            await Payments.findOrCreate({
                where: { transaction_id: transactionId },
                defaults: {
                    donation_id: paymentMethod.donation_id,
                    payment_method_id: paymentMethod.payment_method_id,
                    amount: paymentMethod.amount,
                    currency: paymentMethod.currency,
                    payment_status: 'PAID',
                    transaction_id: transactionId,
                    external_reference: `ER-${transactionId}`,
                    paid_at: new Date()
                },
                transaction: t
            })
           

            // Update donation status
            const newDonation = await Donations.update(
                { status: 'RECEIVED' },
                { where: { donation_id: paymentMethod.donation_id },
                transaction: t
            }
            )

            if(!newDonation) { 
                res.json({ message: 'new donation failed to update the status' }) 
                await t.rollback()
            }

            await t.commit()

            // Emit real-time update for donation amount changes
            const donation = await Donations.findByPk(paymentMethod.donation_id);
            if (donation) {
                emitDonationUpdate(
                    donation.event_id,
                    donation.donation_id,
                    paymentMethod.amount,
                    paymentMethod.currency
                );
            }

            return res.json({ success: true, message: 'Payment processed successfully' })

        } else if (type === 'checkout_session.payment_failed' || type === 'payment.failed') {
            const checkoutSession = data
            const checkoutSessionId = checkoutSession.id


            // Find the payment method
            const paymentMethod = await PaymentMethod.findOne({
                where: { external_reference: `ER-${checkoutSessionId}` }
            })

            if (paymentMethod) {
                // Update payment method status to failed
                await paymentMethod.update({
                    payment_status: 'FAILED',
                    paid_at: new Date(),
                })

                // Update donation status
                const donation = await Donations.findByPk(paymentMethod.donation_id)
                if (donation) {
                    await donation.update({ status: 'PENDING' })
                }
            }

            return res.json({ success: true, message: 'Payment failure processed' })

        } else if(type === 'checkout_session.cancelled') {
            const checkoutSession = data
            const checkoutSessionId = checkoutSession.id


            // Find the payment method
            const paymentMethod = await PaymentMethod.findOne({
                where: { external_reference: `ER-${checkoutSessionId}` }
            })

            if (paymentMethod) {
                // Update payment method status to failed
                await paymentMethod.update({
                    payment_status: 'CANCELLED',
                    paid_at: new Date(),
                })

                // Update donation status
                const donation = await Donations.findByPk(paymentMethod.donation_id)
                if (donation) {
                    await donation.update({ status: 'PENDING' })
                }
            }

            return res.json({ success: true, message: 'Payment failure processed' })

        } else {
            return res.json({ success: true, message: 'Event type not handled' })
        }

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('webhook payment failed: ', error.message)
    }
}

