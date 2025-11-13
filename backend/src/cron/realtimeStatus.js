import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { updateEventStatus, updateEventParticipantCount } from '../socket.js';
import { createEventNotification } from '../services/notificationService.js';

const { Event, EventRegistration } = models;

cron.schedule('*/30 * * * * *', async () => {
    try {
        const now = new Date();
        console.log('Event Status Cron triggered at', now.toLocaleString());

        const ongoingMatches = await Event.findAll({
            where: {
                event_started: { [Op.lte]: now },
                event_ended: { [Op.gte]: now },
                status: 'Upcoming',
            },
        });

        console.log('Events to start (Ongoing):', ongoingMatches.length);

        let ongoingUpdatedCount = 0;
        if (ongoingMatches.length > 0) {
            for (const event of ongoingMatches) {
                event.status = 'Ongoing';
                await event.save();
                await createEventNotification('event_started', event);
                updateEventStatus(event.event_id, event.status);
                ongoingUpdatedCount++;
            }
        }

        const completedMatches = await Event.findAll({
            where: {
                event_ended: { [Op.lt]: now },
                status: { [Op.in]: ['Upcoming', 'Ongoing'] },
            },
        });

        console.log('Events to complete:', completedMatches.length);

        let completedUpdatedCount = 0;
        if (completedMatches.length > 0) {
            for (const event of completedMatches) {
                event.status = 'Completed';
                await event.save();
                await createEventNotification('event_ended', event);
                updateEventStatus(event.event_id, event.status);
                completedUpdatedCount++;
            }
        }

        console.log(
            `Event Status Updater -> ${ongoingUpdatedCount} events set to Ongoing, -> ${completedUpdatedCount} events set to Completed.`
        );
    } catch (error) {
        console.error('Event Status Updater Error:', error.message);
    }
});

cron.schedule('*/30 * * * * *', async () => {
    try {
        const now = new Date();
        console.log('Participant Count Updater triggered at', now.toLocaleString());

        const events = await Event.findAll({
            where: {
                status: { [Op.ne]: 'Cancelled' }
            },
            attributes: ['event_id']
        });

        console.log('Updating participant counts for', events.length, 'events');

        let updatedCount = 0;
        for (const event of events) {
            const participantCount = await EventRegistration.count({
                where: {
                    event_id: event.event_id,
                    status: 'registered'
                }
            });

            await Event.update(
                { participants: participantCount },
                { where: { event_id: event.event_id } }
            );

            updateEventParticipantCount(event.event_id, participantCount);
            updatedCount++;
        }

        console.log(`Participant Count Updater -> Updated ${updatedCount} events with participant counts.`);
    } catch (error) {
        console.error('Participant Count Updater Error:', error.message);
    }
});
