import { paymongo } from '../../config/paymongo.js';
import models from '../../models/index.js';
import { logDirectorActivity } from '../../services/activityLogService.js';

export const connectDirectorPayment = async (req, res) => {
    try {
        const { paymentMethods } = req.validatedBody;
        const { Accounts, LinkedPaymentAccounts } = models;

        const validPaymentMethods = ['gcash', 'card', 'bpi', 'ubp', 'paymaya'];
        if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
            return res.json({ 
                success: false, 
                message: 'Payment methods array is required.' 
            });
        }

        // Validate each payment method
        for (const method of paymentMethods) {
            if (!validPaymentMethods.includes(method)) {
                return res.json({ 
                    success: false, 
                    message: `Invalid payment method: ${method}. Please select valid payment methods.` 
                });
            }
        }

        const account = await Accounts.findByPk(req.user.account_id);
        if (!account) { 
            return res.json({ 
                success: false, 
                message: 'Account not found' 
            }); 
        }

        // Check for existing payment methods to prevent duplicates
        const existingPayments = await LinkedPaymentAccounts.findAll({
            where: { 
                account_id: account.account_id,
                status: 'ACTIVE'
            }
        });

        // Get existing payment method types
        const existingMethodTypes = existingPayments.map(payment => 
            payment.payment_method_types ? payment.payment_method_types[0] : null
        ).filter(Boolean);

        // Check if any of the requested payment methods already exist
        const duplicateMethods = paymentMethods.filter(method => 
            existingMethodTypes.includes(method)
        );

        if (duplicateMethods.length > 0) {
            // Create detailed error message for each duplicate method
            const methodNames = {
                'gcash': 'GCash',
                'card': 'Credit Card',
                'bpi': 'BPI',
                'ubp': 'UnionBank',
                'paymaya': 'PayMaya'
            };
            
            const duplicateMethodNames = duplicateMethods.map(method => 
                methodNames[method] || method
            );
            
            return res.json({
                success: false,
                message: `Payment method(s) already configured: ${duplicateMethodNames.join(', ')}. Please choose different payment methods.`,
                duplicateMethods: duplicateMethods,
                duplicateMethodNames: duplicateMethodNames
            });
        }

        const checkoutUrls = [];

        // Loop through each payment method and create separate checkout sessions
        for (const method of paymentMethods) {
            const apiMethodType = method === 'gcash' ? 'gcash' : 'card';

            const payload = {
                data: {
                    attributes: {
                        send_email_receipt: false,
                        show_description: true,
                        show_line_items: true,
                        description: `Payment verification for ${method}`,
                        cancel_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/director/payment-status?payment=cancelled`,
                        success_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/director/payment-status?payment=success`,
                        payment_method_types: [apiMethodType],
                        line_items: [
                            {
                                name: `Verify ${method} account`,
                                description: `Verification payment for director: ${account.email}`,
                                amount: 100, // ₱1.00 = 100 centavos
                                currency: 'PHP',
                                quantity: 10,
                            },
                        ],
                        metadata: {
                            director_id: account.account_id.toString(),
                            payment_method: method,
                            verification: 'true'
                        }
                    }
                }
            };

            const response = await paymongo.post('/checkout_sessions', payload);

            const linkedPayment = await LinkedPaymentAccounts.create({
                account_id: account.account_id,
                description: response.data.data.attributes.line_items[0].description,
                payment_method_types: [method], // store original method for reference
                currency: response.data.data.attributes.line_items[0].currency,
                checkout_url: response.data.data.attributes.checkout_url,
                status: 'ACTIVE'
            });

            checkoutUrls.push({
                method,
                checkout_url: response.data.data.attributes.checkout_url
            });
        }

        // Log activity
        await logDirectorActivity(req.user.account_id, 'create', 'payment', `Created payment link(s) for methods: ${paymentMethods.join(', ')}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        res.json({
            success: true,
            message: 'Payment link(s) created successfully',
            checkout_url: checkoutUrls[0]?.checkout_url || null,
            checkoutUrls
        });

    } catch (error) {
        console.log('connectDirectorPayment failed:', error.response?.data || error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getPaymentMethods = async (req, res) => {
    try {
        const { LinkedPaymentAccounts, Accounts } = models;

        const paymentsData = await LinkedPaymentAccounts.findAll({
            where: { account_id: req.user.account_id },
            include: [
                { 
                    model: Accounts,
                    attributes: ['email']
                }
            ],
            attributes: ['linked_payment_account_id', 'account_id', 'description', 'payment_method_types', 'currency', 'checkout_url', 'status', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']]
        });

        // Get existing payment method types for frontend filtering
        const existingMethodTypes = paymentsData.map(payment => 
            payment.payment_method_types ? payment.payment_method_types[0] : null
        ).filter(Boolean);

        // Define all available payment methods
        const allPaymentMethods = ['gcash', 'card', 'bpi', 'ubp', 'paymaya'];
        
        // Get available (not yet added) payment methods
        const availableMethods = allPaymentMethods.filter(method => 
            !existingMethodTypes.includes(method)
        );

        if(paymentsData.length === 0) { 
            return res.json({ 
                success: true,
                paymentsData: [],
                availableMethods: allPaymentMethods,
                message: 'No payment methods configured yet.' 
            }); 
        }

        return res.json({ 
            success: true, 
            paymentsData: paymentsData,
            count: paymentsData.length,
            availableMethods: availableMethods,
            existingMethodTypes: existingMethodTypes
        });

    } catch (error) {
        console.log('get payment method failed: ', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.validatedBody;
        const { LinkedPaymentAccounts } = models;

        // Validate status
        const validStatuses = ['ACTIVE', 'INACTIVE'];
        if (!validStatuses.includes(status)) {
            return res.json({
                success: false,
                message: 'Invalid status. Must be ACTIVE or INACTIVE.'
            });
        }

        // Find the payment method using the correct primary key
        const payment = await LinkedPaymentAccounts.findOne({
            where: { 
                linked_payment_account_id: paymentId,
                account_id: req.user.account_id 
            }
        });

        if (!payment) {
            return res.json({
                success: false,
                message: 'Payment method not found or access denied.'
            });
        }

        // Update the status
        await payment.update({ status });

        // Log activity
        await logDirectorActivity(req.user.account_id, 'update', 'payment', `Updated payment method status to ${status} for method: ${payment.payment_method_types?.[0] || 'unknown'}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.json({
            success: true,
            message: `Payment method status updated to ${status} successfully.`,
            payment: {
                id: payment.id,
                status: payment.status,
                payment_method_types: payment.payment_method_types
            }
        });

    } catch (error) {
        console.log('update payment status failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const removePaymentMethod = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { LinkedPaymentAccounts } = models;

        // Find the payment method using the correct primary key
        const payment = await LinkedPaymentAccounts.findOne({
            where: { 
                linked_payment_account_id: paymentId,
                account_id: req.user.account_id 
            }
        });

        if (!payment) {
            return res.json({
                success: false,
                message: 'Payment method not found or access denied.'
            });
        }

        // Delete the payment method
        const paymentMethodType = payment.payment_method_types?.[0] || 'unknown';
        await payment.destroy();

        // Log activity
        await logDirectorActivity(req.user.account_id, 'delete', 'payment', `Removed payment method: ${paymentMethodType}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        return res.json({
            success: true,
            message: 'Payment method removed successfully.',
            removedPayment: {
                id: payment.id,
                payment_method_types: payment.payment_method_types
            }
        });

    } catch (error) {
        console.log('remove payment method failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const updatePaymentMethod = async (req, res) => {
    try {
        const { paymentMethods, paymentId } = req.validatedBody;
        const { Accounts, LinkedPaymentAccounts } = models;
        
        console.log('Update payment method - paymentMethods:', paymentMethods, 'paymentId:', paymentId);
        
        const numericPaymentId = paymentId ? (typeof paymentId === 'string' ? parseInt(paymentId, 10) : paymentId) : null;

        const validPaymentMethods = ['gcash', 'card', 'bpi', 'ubp', 'paymaya'];
        if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
            console.log('Payment methods validation failed');
            return res.json({ 
                success: false, 
                message: 'Payment methods array is required.' 
            });
        }

        // Validate each payment method
        for (const method of paymentMethods) {
            if (!validPaymentMethods.includes(method)) {
                console.log('Invalid payment method:', method);
                return res.json({ 
                    success: false, 
                    message: `Invalid payment method: ${method}. Please select valid payment methods.` 
                });
            }
        }

        console.log('Finding account with ID:', req.user.account_id);
        const account = await Accounts.findByPk(req.user.account_id);
        if (!account) { 
            console.log('Account not found');
            return res.json({ 
                success: false, 
                message: 'Account not found' 
            }); 
        }
        console.log('Account found:', account.email);

        const checkoutUrls = [];

        // Loop through each payment method and create separate checkout sessions
        for (const method of paymentMethods) {
            const apiMethodType = method === 'gcash' ? 'gcash' : 'card';

            const payload = {
                data: {
                    attributes: {
                        send_email_receipt: false,
                        show_description: true,
                        show_line_items: true,
                        description: `Update payment verification for ${method}`,
                        cancel_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/director/payment-status?payment=cancelled&type=update`,
                        success_url: `${process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD}/director/payment-status?payment=success&type=update`,
                        payment_method_types: [apiMethodType],
                        line_items: [
                            {
                                name: `Update ${method} account`,
                                description: `Update verification payment for director: ${account.email}`,
                                amount: 100, // ₱1.00 = 100 centavos
                                currency: 'PHP',
                                quantity: 1,
                            },
                        ],
                        metadata: {
                            director_id: account.account_id.toString(),
                            payment_method: method,
                            verification: 'true',
                            operation: 'update'
                        }
                    }
                }
            };

            console.log('Creating PayMongo checkout session for method:', method);
            const response = await paymongo.post('/checkout_sessions', payload);
            console.log('PayMongo response received:', response.data);
            
            // Check if response is valid
            if (!response.data || !response.data.data || !response.data.data.attributes) {
                console.log('Invalid PayMongo response structure');
                throw new Error('Invalid PayMongo response');
            }

           
            const linkedPayment = await LinkedPaymentAccounts.update({
                account_id: account.account_id,
                description: response.data.data.attributes.line_items[0].description,
                payment_method_types: [method], // store original method for reference
                currency: response.data.data.attributes.line_items[0].currency,
                checkout_url: response.data.data.attributes.checkout_url,
                status: 'ACTIVE', // Set to ACTIVE like connectDirectorPayment
                updatedAt: new Date() // Add timestamp when updating (camelCase)
            }, { where: { linked_payment_account_id: numericPaymentId } });

            if(!linkedPayment) { return res.json({ message: 'Payment method not found or access denied.' }) }

            checkoutUrls.push({
                method,
                checkout_url: response.data.data.attributes.checkout_url
            });
        }

        // Log activity
        await logDirectorActivity(req.user.account_id, 'update', 'payment', `Updated payment method(s): ${paymentMethods.join(', ')}`, req.ip || req.connection.remoteAddress, req.get('user-agent'));

        res.json({
            success: true,
            message: 'Payment update link(s) created successfully',
            checkout_url: checkoutUrls[0]?.checkout_url || null,
            checkoutUrls
        });

    } catch (error) {
        console.log('updatePaymentMethod failed:', error.response?.data || error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}