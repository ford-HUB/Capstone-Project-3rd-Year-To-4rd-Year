import cron from 'node-cron';
import models from '../models/index.js';
import { Op } from 'sequelize';

const { PaymentMethod, Payments, Donations } = models;

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
    try {
        const now = new Date();
        const cutoff = new Date(now - 15 * 60 * 1000); // 15 minutes ago

        console.log(`[Payment Status Updater] Cron triggered at ${now.toLocaleString()}`);
        console.log(`[Payment Status Updater] Checking for payments older than 15 minutes...`);
        console.log(`[Payment Status Updater] Cutoff time: ${cutoff.toISOString()}`);

        // Update PaymentMethod table - payments that are PENDING and older than 15 minutes
        const paymentMethodResult = await PaymentMethod.update(
            { 
                payment_status: 'CANCELLED',
                paid_at: new Date()
            },
            { 
                where: { 
                    payment_status: 'PENDING',
                    createdAt: { [Op.lt]: cutoff }
                }
            }
        );

        console.log(`[Payment Status Updater] Updated ${paymentMethodResult[0]} payment methods to CANCELLED`);

        // Also update Payments table if needed
        const paymentsResult = await Payments.update(
            { 
                payment_status: 'CANCELLED',
                paid_at: new Date()
            },
            { 
                where: { 
                    payment_status: 'PENDING',
                    createdAt: { [Op.lt]: cutoff }
                }
            }
        );

        console.log(`[Payment Status Updater] Updated ${paymentsResult[0]} payments to CANCELLED`);

        // Update related donations to PENDING status if they were still PENDING
        const donationsResult = await Donations.update(
            { status: 'PENDING' },
            { 
                where: { 
                    status: 'PENDING',
                    updatedAt: { [Op.lt]: cutoff }
                }
            }
        );

        console.log(`[Payment Status Updater] Updated ${donationsResult[0]} donations to PENDING`);

        console.log(`[Payment Status Updater] Cron job completed successfully`);

    } catch (error) {
        console.error('[Payment Status Updater] Error updating payment status:', error.message);
        console.error('[Payment Status Updater] Full error:', error);
    }
}, { timezone: 'UTC' });
