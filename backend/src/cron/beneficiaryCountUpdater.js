import cron from 'node-cron';
import { Op, fn, col } from 'sequelize';
import models from '../models/index.js';

const { Event, EventRegistration } = models;

// Reconcile Event.participants from EventRegistration every 5 minutes
cron.schedule('0 */5 * * * *', async () => {
	try {
		const now = new Date();
		console.log('Beneficiary/Participants Count Reconciler triggered at', now.toLocaleString());

		// Consider non-completed events primarily; but we can reconcile all
		const events = await Event.findAll({
			attributes: ['event_id'],
			where: {
				status: { [Op.ne]: 'Completed' }
			},
			raw: true
		});

		if (events.length === 0) {
			return;
		}

		const eventIds = events.map(e => e.event_id);

		// Count all registrations (all participant types) per event
		const counts = await EventRegistration.findAll({
			attributes: ['event_id', [fn('COUNT', col('event_id')), 'count']],
			where: {
				event_id: { [Op.in]: eventIds }
			},
			group: ['event_id'],
			raw: true
		});

		const idToCount = new Map(counts.map(c => [c.event_id, parseInt(c.count, 10)]));

		let updated = 0;
		for (const eventId of eventIds) {
			const total = idToCount.get(eventId) || 0;
			await Event.update(
				{ participants: total },
				{ where: { event_id: eventId } }
			);
			updated++;
		}

		if (updated > 0) {
			console.log(`Participants Reconciler -> Updated ${updated} events`);
		}
	} catch (error) {
		console.error('Participants Reconciler Cron Error:', error.message);
	}
}, { timezone: 'UTC' });



