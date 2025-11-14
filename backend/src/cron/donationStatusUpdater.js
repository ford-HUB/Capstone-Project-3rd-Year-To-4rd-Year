import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { sendDonationStatusUpdateEmail } from '../services/donationEmailService.js';

const { Donations, Event, Donor, Accounts } = models;

cron.schedule('0 */5 * * * *', async () => {
    try {
        const now = new Date();
        
        console.log('Donation Status Update Cron triggered at', now.toLocaleString());

        // Find events that have just started (within the last 5 minutes)
        const eventsStarted = await Event.findAll({
            where: {
                status: 'Ongoing',
                event_started: {
                    [Op.between]: [new Date(now.getTime() - 5 * 60 * 1000), now]
                }
            },
            attributes: ['event_id', 'title', 'event_started', 'event_ended']
        });

        console.log('Events that started:', eventsStarted.length);

        let updatedToDistributed = 0;
        let emailsSent = 0;

        for (const event of eventsStarted) {
            try {
                // Find all donations for this event that are still RECEIVED
                const donationsToUpdate = await Donations.findAll({
                    where: {
                        event_id: event.event_id,
                        status: 'RECEIVED',
                    },
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email'],
                            include: [
                                { 
                                    model: Donor,
                                    attributes: ['fullname']
                                }
                            ]
                        },
                        {
                            model: Event,
                            attributes: ['location']
                        }
                    ],
                    
                    attributes: ['donation_id', 'donation_type', 'status']
                });

                // Update donations to DISTRIBUTED
                for (const donation of donationsToUpdate) {
                    await donation.update({ 
                        status: 'DISTRIBUTED',
                        remark: `Distributed at ${donation.Event.location}`,
                        updatedAt: new Date()
                    });
                    updatedToDistributed++;

                    // Send email notification to donor
                    if (donation.Account?.email) {
                        await sendDonationStatusUpdateEmail({
                            donorEmail: donation.Account.email,
                            donorName: donation.Account.Donor?.fullname || 'Donor',
                            eventTitle: event.title,
                            donationId: donation.donation_id,
                            donationType: donation.donation_type,
                            newStatus: 'DISTRIBUTED',
                            remark: `Distributed at ${donation.Event.location}`,
                            eventStartDate: event.event_started
                        });
                        emailsSent++;

                        await new Promise(resolve => setTimeout(resolve, 8000)) // wait 3 sec before next mail fire
                    }
                }
            } catch (error) {
                console.error(`Failed to update donations for event ${event.event_id}:`, error.message);
            }
        }

        console.log(`Donation Status Update -> ${updatedToDistributed} donations updated to DISTRIBUTED, ${emailsSent} emails sent.`);
    } catch (error) {
        console.error('Donation Status Update Cron Error:', error.message);
    }
});

// Run every 5 minutes to check for events that have finished
cron.schedule('*/30 * * * * *', async () => {
    try {
        const now = new Date();
        
        console.log('Donation Completion Cron triggered at', now.toLocaleString());

        // Find all completed events (not just ones that finished in the last 5 minutes)
        // This ensures we catch all events that have ended, even if they were completed earlier
        const eventsFinished = await Event.findAll({
            where: {
                status: 'Completed',
                event_ended: {
                    [Op.lt]: now  // Event has ended (any time in the past)
                }
            },
            attributes: ['event_id', 'title', 'event_started', 'event_ended']
        });

        console.log('Completed events found:', eventsFinished.length);

        let updatedToCompleted = 0;
        let emailsSent = 0;

        for (const event of eventsFinished) {
            try {
                // Find all donations for this event that are still DISTRIBUTED
                const donationsToUpdate = await Donations.findAll({
                    where: {
                        event_id: event.event_id,
                        status: 'DISTRIBUTED'
                    },
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email'],
                            include: [
                                {
                                    model: Donor,
                                    attributes: ['fullname']
                                }
                            ]
                        }
                    ],
                    attributes: ['donation_id', 'donation_type', 'status']
                });

                console.log(`Event ${event.event_id} (${event.title}): Found ${donationsToUpdate.length} donations with DISTRIBUTED status`);

                // Also check what other statuses exist for this event
                const allDonationsForEvent = await Donations.findAll({
                    where: {
                        event_id: event.event_id
                    },
                    attributes: ['donation_id', 'status']
                });
                
                const statusCounts = {};
                allDonationsForEvent.forEach(d => {
                    statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
                });
                console.log(`Event ${event.event_id} donation status breakdown:`, statusCounts);

                // Update donations to COMPLETED
                for (const donation of donationsToUpdate) {
                    await donation.update({ 
                        status: 'COMPLETED',
                        updatedAt: new Date()
                    });
                    updatedToCompleted++;

                    // Send email notification to donor
                    if (donation.Account?.email) {
                        await sendDonationStatusUpdateEmail({
                            donorEmail: donation.Account.email,
                            donorName: donation.Account.Donor?.fullname || 'Donor',
                            eventTitle: event.title,
                            donationId: donation.donation_id,
                            donationType: donation.donation_type,
                            newStatus: 'COMPLETED',
                            eventStartDate: event.event_started,
                            eventEndDate: event.event_ended
                        });
                        emailsSent++;
                    }
                }
            } catch (error) {
                console.error(`Failed to complete donations for event ${event.event_id}:`, error.message);
            }
        }

        console.log(`Donation Completion -> ${updatedToCompleted} donations updated to COMPLETED, ${emailsSent} emails sent.`);
    } catch (error) {
        console.error('Donation Completion Cron Error:', error.message);
    }
});

console.log('Donation Status Update Cron Jobs initialized');
