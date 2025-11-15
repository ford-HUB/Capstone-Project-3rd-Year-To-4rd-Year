import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { createEventNotification } from '../services/notificationService.js';

const { Event } = models;

// Run every 5 minutes to check for upcoming events
cron.schedule('*/5 * * * *', async () => {
    try {
        const now = new Date();
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now

        console.log('Event Reminder Cron triggered at', now.toLocaleString());

        // Find upcoming events that start within 30 minutes and haven't been notified
        const upcomingEvents = await Event.findAll({
            where: { 
                status: 'Upcoming',
                event_started: { 
                    [Op.between]: [now, thirtyMinutesLater]
                },
                notified_before_starting: false
            },
        });

        console.log('Upcoming events to notify:', upcomingEvents.length);

        let notifiedCount = 0;
        if (upcomingEvents.length > 0) {
            for (const event of upcomingEvents) {
                await createEventNotification('event_reminder', event);
    
                // Mark as notified to prevent duplicate notifications
                await event.update({ notified_before_starting: true }); 
                notifiedCount++;
            }
        }

        console.log(`Event Reminder -> ${notifiedCount} events notified.`);
    } catch (error) {
        console.error('Event Reminder Cron Error:', error.message);
    }
}, { timezone: 'UTC' });
