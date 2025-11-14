import cron from 'node-cron'
import models from '../models/index.js';
import { Op } from 'sequelize';
import { sendMail } from '../services/mailService.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { dirname as getDirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = getDirname(__filename);

// Run every 5 minutes to process pending form link notifications
cron.schedule('0 */5 * * * *', async () => {
    try {
        const { Event, Attendance, FormLink, EventRegistration, Volunteer, Student, Accounts } = models

        const AttendanceCompletedProcess = await Attendance.findAll({
            where: {
                time_in: { [Op.ne]: null },
                time_out: { [Op.ne]: null },
                status: 'recorded'
            },
            include: [
                { 
                    model: Event,
                    where: { status: 'Completed' },
                    required: true
                }
            ]
        })

        for(const attendance of AttendanceCompletedProcess) {
            try {
                // Get the event registered participant (volunteer)
                const eventRegisteredParticipant = await EventRegistration.findOne({ 
                    where: { 
                        participant_id: attendance.participant_id, 
                        participant_type: 'volunteer',
                        event_id: attendance.event_id
                    },
                    include: [
                        { 
                            model: Volunteer,
                            include: [
                                {
                                    model: Student,
                                    include: [
                                        {
                                            model: Accounts,
                                            required: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ] 
                })

                // Skip if no registered participant found
                if (!eventRegisteredParticipant) {
                    console.log(`No registered volunteer found for attendance ID: ${attendance.attendance_id}`);
                    continue;
                }

                // Get the form link record for this event that hasn't been mailed yet
                const eventFormLinkRecord = await FormLink.findOne({ 
                    where: { 
                        event_id: attendance.event_id,
                        target_role: 'volunteer',
                        form_mail_sent: false,
                        form_link: { [Op.ne]: null } // Ensure form_link exists
                    }
                })

                // Skip if no form link found or already mailed
                if (!eventFormLinkRecord) {
                    console.log(`No pending form link found for event: ${attendance.Event.title}`);
                    continue;
                }

                // Get participant details
                const participantEmail = eventRegisteredParticipant?.Volunteer?.Student?.Account.email;
                const participantName = `${eventRegisteredParticipant?.Volunteer?.Student?.firstname} ${eventRegisteredParticipant?.Volunteer?.Student?.lastname}`;
                const eventName = attendance.Event.title;
                const googleFormLink = eventFormLinkRecord.form_link;

                // Send the email
                await sendMail(
                    participantEmail,
                    `Event Evaluation Form - ${eventName}`,
                    { text: `Please complete the evaluation form for ${eventName}` },
                    'formLinkNotification.html',
                    {
                        participant_name: participantName,
                        event_name: eventName,
                        google_form_link: googleFormLink
                    }
                );

                // Update the form_mail_sent flag to prevent repeated sending
                await FormLink.update(
                    { form_mail_sent: true },
                    { where: { formlink_id: eventFormLinkRecord.formlink_id } }
                );

                console.log(`Form notification sent to ${participantName} (${participantEmail}) for event: ${eventName}`);
                console.log(`Form link: ${googleFormLink}`);

            } catch (participantError) {
                console.error(`Error processing attendance ID ${attendance.attendance_id}:`, participantError.message);
                continue; // Continue with next attendance record
            }
        }

        console.log('Form pusher cron job completed successfully');

    } catch (error) {
        console.error('Form mailer pusher Cron Error:', error.message);
    }
});
