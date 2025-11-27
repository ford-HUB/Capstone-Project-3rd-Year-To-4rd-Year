import { paymongo } from "../../config/paymongo.js";
import models from "../../models/index.js";
import { emitDonationUpdate, notifyNewDonation } from "../../socket.js";
import { logDonorActivity } from "../../services/activityLogService.js";

export const getAvailablePaymentMethods = async (req, res) => {
    try {
        const { LinkedPaymentAccounts } = models;

        // Get all active payment accounts that can be used for donations
        const paymentAccounts = await LinkedPaymentAccounts.findAll({
            where: { 
                status: 'ACTIVE'
            },
            attributes: ['linked_payment_account_id', 'description', 'payment_method_types', 'currency'],
            order: [['createdAt', 'DESC']]
        });

        if (paymentAccounts.length === 0) {
            return res.json({ 
                success: true,
                paymentMethods: [],
                message: 'No payment methods available for donations.' 
            });
        }

        // Extract unique payment method types from all accounts
        const allPaymentMethods = new Set();
        paymentAccounts.forEach(account => {
            if (account.payment_method_types && Array.isArray(account.payment_method_types)) {
                account.payment_method_types.forEach(method => {
                    allPaymentMethods.add(method);
                });
            }
        });

        // Return raw payment method types - frontend will handle mapping
        const availableMethods = Array.from(allPaymentMethods);

        return res.json({ 
            success: true, 
            paymentMethods: availableMethods,
            paymentAccounts: paymentAccounts,
            count: availableMethods.length
        });

    } catch (error) {
        console.log('get available payment methods failed: ', error.message);
        return res.json({ 
            success: false, 
            message: 'Failed to fetch payment methods',
            error: error.message 
        });
    }
};

export const donationPay = async (req, res) => {
    try {
        const { amount, description, isAnonymous, mailReceipt } = req.validatedBody
        const { linkedPaymentAccountId, event_id } = req.params

        // Validate URL parameters
        if (!linkedPaymentAccountId) {
            return res.json({ message: 'Linked payment account ID is required' })
        }
        if (!event_id) {
            return res.json({ message: 'Event ID is required' })
        }

        const { LinkedPaymentAccounts, Donations, Accounts, Donor, Event, PaymentMethod } = models
        const linkedAccount = await LinkedPaymentAccounts.findByPk(linkedPaymentAccountId)
        if(!linkedAccount) { return res.json({ message: 'linked payment account not found' }) }

        const event = await Event.findByPk(event_id)
        if(!event) { return res.json({ message: 'event not found' }) }

        const account = await Accounts.findByPk(req.user.account_id)
        if(!account) { return res.json({ message: 'account not found' }) }

        const donor = await Donor.findOne({ where: { account_id: req.user.account_id } })
        if(!donor) { return res.json({ message: 'donor not found' }) }

        // Create donation first
        const donation = await Donations.create({
            event_id: event.event_id,
            account_id: req.user.account_id,
            donation_type: 'MONEY',
            status: 'PENDING',
            is_anonymous: isAnonymous || false,
            mail_reciept: mailReceipt || false
        })
        
        const checkoutPayload = {
            data: {
                attributes: {
                    send_email_receipt: false,
                    show_description: true,
                    show_line_items: true,
                    description: description,
                    cancel_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donation-cancelled?donation_id=${donation.donation_id}`,
                    success_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/donation-success?donation_id=${donation.donation_id}`,
                    payment_method_types: linkedAccount.payment_method_types,
                    line_items: [
                        {
                            name: `Donation for ${event.title}`,
                            description: description,
                            amount: amount * 100,
                            currency: linkedAccount.currency,
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        donation_id: donation.donation_id.toString(),
                        event_id: event.event_id.toString(),
                        donor_id: donor.donor_id.toString()
                    }
                },
            },
        };

        const checkoutResponse = await paymongo.post('/checkout_sessions', checkoutPayload)
        const checkoutSession = checkoutResponse.data.data

        const paymentMethod = await PaymentMethod.create({
            donation_id: donation.donation_id,
            amount: amount,
            currency: linkedAccount.currency,
            payment_method: linkedAccount.payment_method_types,
            external_referrence: `ER-${checkoutSession.id}`,
            payment_status: 'PENDING',
            paid_at: new Date()
        })

        if(!paymentMethod) { return res.json({ message: 'payment method failed to insert' }) }

        // Log activity - Make donation payment
        const eventTitle = event.title || `Event ID: ${event_id}`
        await logDonorActivity(
            req.user.account_id,
            'create',
            'donation',
            `Initiated money donation (${amount} ${linkedAccount.currency}) for event: ${eventTitle}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({ 
            success: true, 
            check_out_url: checkoutSession.attributes.checkout_url,
            checkout_session_id: checkoutSession.id
        })

    } catch (error) {
        console.log('donate pay failed: ', error.message)
        console.log('Full error details:', error.response?.data || error)
        res.json({ success: false, message: 'Internal Server Error', error: error.response?.data || error.message })
    }
}

export const handlePaymentSuccess = async (req, res) => {
    try {
        const { checkout_session_id } = req.validatedBody
        const { PaymentMethod, Payments, Donations } = models

        // Find the payment method
        const paymentMethod = await PaymentMethod.findOne({
            where: { external_referrence: checkout_session_id }
        })

        console.log('Found payment method:', paymentMethod)

        if (!paymentMethod) {
            return res.json({ success: false, message: 'Payment method not found' })
        }

        // Update payment method status
        await paymentMethod.update({
            payment_status: 'PAID',
            paid_at: new Date()
        })

        // Check if payment record already exists to prevent duplication
        let payment = await Payments.findOne({
            where: { 
                donation_id: paymentMethod.donation_id,
                transaction_id: checkout_session_id
            }
        })

        // Create payment record only if it doesn't exist
        if (!payment) {
            payment = await Payments.create({
                donation_id: paymentMethod.donation_id,
                payment_method_id: paymentMethod.payment_method_id,
                amount: paymentMethod.amount,
                currency: paymentMethod.currency,
                payment_status: 'PAID',
                transaction_id: checkout_session_id,
                external_reference: checkout_session_id,
                paid_at: new Date()
            })
        }

        console.log('Created payment record:', payment)

        // Update donation status
        const donation = await Donations.findByPk(paymentMethod.donation_id, {
            include: [
                { model: models.Event, attributes: ['title'] },
                { model: models.Accounts, attributes: ['email'] }
            ]
        })
        if (donation) {
            await donation.update({ status: 'RECEIVED' })
            
            // Emit real-time update for donation amount changes
            emitDonationUpdate(
                donation.event_id,
                donation.donation_id,
                paymentMethod.amount,
                paymentMethod.currency
            );

            // Get donor name
            const { Donor } = models;
            const donor = await Donor.findOne({ where: { account_id: donation.account_id } });
            const donorName = donation.is_anonymous ? 'Anonymous' : (donor?.fullname || donor?.name || donation.Accounts?.email || 'Donor');

            // Emit real-time notification for new donation
            notifyNewDonation({
                donation_id: donation.donation_id,
                donation_type: 'MONEY',
                amount: paymentMethod.amount,
                status: 'RECEIVED',
                donor_name: donorName,
                is_anonymous: donation.is_anonymous || false,
                event_name: donation.Event?.title || 'General Donation',
                goods_description: '',
                goods_quantity: '',
                payment_method: paymentMethod.payment_method || 'Online Payment',
                transaction_id: checkout_session_id
            });
        }

        return res.json({ 
            success: true, 
            message: 'Payment processed successfully',
            payment_id: payment.payment_id
        })

    } catch (error) {
        console.log('payment success handling failed: ', error.message)
        console.log('Full error details:', error.response?.data || error)
        res.json({ success: false, message: 'Internal Server Error', error: error.response?.data || error.message })
    }
}

export const verifyPaymentCancellation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { PaymentMethod } = models;

        // Find the payment method by donation ID
        const paymentMethod = await PaymentMethod.findOne({
            where: { donation_id: donationId }
        });

        if (!paymentMethod) {
            return res.json({
                success: false,
                message: 'Payment method not found',
                isCancelled: false
            });
        }

        if (paymentMethod.payment_status === 'PENDING') {
            await paymentMethod.update({
                payment_status: 'CANCELLED',
                paid_at: new Date()
            });
        }

        const isCancelled = paymentMethod.payment_status === 'CANCELLED';
        console.log('Payment status:', paymentMethod.payment_status, 'Is cancelled:', isCancelled);

        return res.json({
            success: true,
            isCancelled: isCancelled,
            paymentStatus: paymentMethod.payment_status,
            message: isCancelled 
                ? 'Payment cancellation confirmed' 
                : 'Payment status verified'
        });

    } catch (error) {
        console.log('Payment cancellation verification failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment cancellation',
            error: error.message
        });
    }
}