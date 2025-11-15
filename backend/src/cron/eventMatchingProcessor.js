import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { runMatchingAIForEvent } from '../services/matchingService.js';
import { runBeneficiaryMatchingAI } from '../services/beneficiaryMatchingService.js';
import { logSystemHealth } from '../utils/performanceMonitor.js';

const { Event, MatchedEvent } = models;

// Run every 2 minutes to process pending event matching (volunteers only)
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
        
        const eventsToProcess = await Event.findAll({
            where: {
                status: { [Op.ne]: 'Completed' },
                updatedAt: { [Op.gte]: tenMinutesAgo }
            },
            order: [['updatedAt', 'DESC']],
            limit: 5 // Process max 5 events per run
        });

        let processedCount = 0;
        
        for (const event of eventsToProcess) {
            try {
                // Process volunteer matching
                const result = await runMatchingAIForEvent(event.event_id);
                if (result > 0) {
                    processedCount += result;
                }
            } catch (error) {
                console.error(`Failed to process matching for event ${event.event_id}:`, error.message);
            }
        }

        // Log only if there was activity
		if (processedCount > 0) {
			console.log(`Event Matching Processor -> ${processedCount} volunteer matches updated`);
        }

    } catch (error) {
        console.error('Event Matching Processor Cron Error:', error.message);
    }
}, { timezone: 'UTC' });

// Run every hour to log system health
cron.schedule('0 * * * *', async () => {
    try {
        await logSystemHealth();
    } catch (error) {
        console.error('System Health Monitor Error:', error.message);
    }
}, { timezone: 'UTC' });

// Run every hour to refresh stale matches
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        
        const staleMatches = await MatchedEvent.findAll({
            where: {
                last_updated: { [Op.lt]: twoHoursAgo }
            },
            limit: 20 // Process max 20 stale matches per run
        });

        let refreshedCount = 0;
        for (const match of staleMatches) {
            try {
                const { runMatchingAI } = await import('../services/matchingService.js');
                const result = await runMatchingAI(match.volunteer_id);
                if (result) {
                    refreshedCount++;
                }
            } catch (error) {
                console.error(`Failed to refresh match for volunteer ${match.volunteer_id}:`, error.message);
            }
        }

        // Log only if there was activity
        if (refreshedCount > 0) {
            console.log(`Stale Match Refresher -> ${refreshedCount} matches refreshed`);
        }

    } catch (error) {
        console.error('Stale Match Refresher Cron Error:', error.message);
    }
}, { timezone: 'UTC' });

// Run every hour to refresh stale beneficiary matches
cron.schedule('15 * * * *', async () => {
	try {
		const now = new Date();
		const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
		
		const staleBeneficiaryMatches = await MatchedEvent.findAll({
			where: {
				beneficiary_id: { [Op.ne]: null },
				last_updated: { [Op.lt]: twoHoursAgo }
			},
			attributes: ['beneficiary_id'],
			limit: 20
		});

		let beneficiaryRefreshed = 0;
		for (const match of staleBeneficiaryMatches) {
			try {
				const result = await runBeneficiaryMatchingAI(match.beneficiary_id);
				if (result) {
					beneficiaryRefreshed++;
				}
			} catch (error) {
				console.error(`Failed to refresh match for beneficiary ${match.beneficiary_id}:`, error.message);
			}
		}

		if (beneficiaryRefreshed > 0) {
			console.log(`Beneficiary Stale Refresher -> ${beneficiaryRefreshed} matches refreshed`);
		}
	} catch (error) {
		console.error('Beneficiary Stale Refresher Cron Error:', error.message);
	}
}, { timezone: 'UTC' });
