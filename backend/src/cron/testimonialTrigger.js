import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { notifyTestimonialRequest } from '../socket.js';

const { EventRegistration, Event, Beneficiary } = models;

cron.schedule('*/5 * * * *', async () => {
    try {
        const now = new Date();
        console.log('Testimonial Trigger Cron triggered at', now.toLocaleString());

        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        const completedRegistrations = await EventRegistration.findAll({
            where: {
                participant_type: 'beneficiary',
                status: 'registered'
            },
            include: [
                {
                    model: Event,
                    required: true,
                    where: {
                        status: 'Completed',
                        event_ended: {
                            [Op.between]: [oneHourAgo, now]
                        }
                    },
                    attributes: ['event_id', 'title', 'event_ended']
                },
                {
                    model: Beneficiary,
                    required: true,
                    attributes: ['beneficiary_id', 'account_id']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log('Completed registrations found:', completedRegistrations.length);

        let notifiedCount = 0;
        for (const registration of completedRegistrations) {
            try {
                const beneficiary = registration.Beneficiary;
                const event = registration.Event;
                const accountId = beneficiary?.account_id;

                if (!beneficiary || !event || !accountId) {
                    continue;
                }

                notifyTestimonialRequest(accountId, {
                    event_id: event.event_id,
                    event_title: event.title,
                    event_ended: event.event_ended,
                    timestamp: new Date().toISOString()
                });

                notifiedCount++;
            } catch (error) {
                console.error(`Error notifying beneficiary ${registration.participant_id} for event ${registration.event_id}:`, error.message);
            }
        }

        if (notifiedCount > 0) {
            console.log(`Testimonial Trigger -> ${notifiedCount} beneficiaries notified.`);
        }
    } catch (error) {
        console.error('Testimonial Trigger Cron Error:', error.message);
    }
}, { timezone: 'UTC' });

