import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';

const { EventRegistration, Attendance, Event } = models;

// Run every 5 minutes to check for completed events and update registration/attendance status
cron.schedule('*/5 * * * *', async () => {
    try {
        const now = new Date();
        console.log('Registration Status Updater Cron triggered at', now.toLocaleString());

        // Find events that have ended (status = 'Completed')
        const completedEvents = await Event.findAll({
            where: {
                status: 'Completed',
                event_ended: { [Op.lt]: now }
            },
            attributes: ['event_id', 'title', 'event_ended']
        });

        console.log('Completed events found:', completedEvents.length);

        let registrationUpdatedCount = 0;
        let attendanceUpdatedCount = 0;

        for (const event of completedEvents) {
            try {
                // Find volunteer registrations for this event that are not already failed
                const registrations = await EventRegistration.findAll({
                    where: {
                        event_id: event.event_id,
                        participant_type: 'volunteer',
                        status: { [Op.ne]: 'failed' } // Not already failed
                    },
                    attributes: ['event_registration_id', 'participant_id', 'status']
                });

                console.log(`Processing ${registrations.length} registrations for event ${event.event_id}`);

                for (const registration of registrations) {
                    try {
                        // Check if attendance record exists and has both time_in and time_out
                        const attendance = await Attendance.findOne({
                            where: {
                                event_id: event.event_id,
                                participant_id: registration.participant_id,
                                participant_type: 'volunteer'
                            },
                            attributes: ['attendance_id', 'time_in', 'time_out', 'status']
                        });

                        // Check if both QR codes were scanned (both time_in and time_out exist)
                        const hasBothScans = attendance && attendance.time_in && attendance.time_out;

                        if (!hasBothScans) {
                            // Update registration status to 'failed'
                            await EventRegistration.update(
                                { status: 'failed' },
                                { where: { event_registration_id: registration.event_registration_id } }
                            );
                            registrationUpdatedCount++;

                            // Update attendance status to 'failed' if attendance record exists
                            if (attendance) {
                                await Attendance.update(
                                    { status: 'failed' },
                                    { where: { attendance_id: attendance.attendance_id } }
                                );
                                attendanceUpdatedCount++;
                            }

                            console.log(
                                `Updated registration ${registration.event_registration_id} and attendance for participant ${registration.participant_id} in event ${event.event_id}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error processing registration ${registration.event_registration_id}:`,
                            error.message
                        );
                    }
                }
            } catch (error) {
                console.error(`Error processing event ${event.event_id}:`, error.message);
            }
        }

        if (registrationUpdatedCount > 0 || attendanceUpdatedCount > 0) {
            console.log(
                `Registration Status Updater -> ${registrationUpdatedCount} registrations marked as failed, ${attendanceUpdatedCount} attendance records marked as failed.`
            );
        }
    } catch (error) {
        console.error('Registration Status Updater Cron Error:', error.message);
    }
});

