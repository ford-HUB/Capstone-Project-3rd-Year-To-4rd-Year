import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { calculateHourService } from '../services/calculateHourService.js';

const { Attendance, Event } = models;

// Run every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
    try {
        const now = new Date();
        console.log('Cron triggered at', now.toLocaleString());

        const attendanceToProcess = await Attendance.findAll({
            where: { participant_type: 'volunteer', status: 'time-out' },
            include: [
                { model: Event,
                    where: { 
                        event_ended: { [Op.lte]: now },
                        status: 'Completed'
                    }    
                }
            ],
            limit: 10,
        });

        console.log('Attendance matched for certificate generation:', attendanceToProcess.length);

        for (const attendance of attendanceToProcess) {
            const success = await calculateHourService(attendance)

            // Mark attendance as recorded if successful operation
            if (success) {
                attendance.status = 'recorded';
                await attendance.save();
            }

        }
    } catch (error) {
        console.error('Cron job error:', error.message);
    }
});
