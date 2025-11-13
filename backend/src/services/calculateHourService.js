import models from "../models/index.js";
import { calculateTotalHours } from "../utils/calculateHourUtils.js";

export const calculateHourService = async (attendance) => {
    try {
        const { Volunteer } = models

        const totalHours = calculateTotalHours(attendance.time_in, attendance.time_out)

        const volunteer = await Volunteer.findByPk(attendance.participant_id)

        if(!volunteer) { 
            console.log({ message: 'volunteer not found' }) 
            return false
        }

        if(totalHours > 0) {
            const addTotalHours = (Number(volunteer.total_hours_volunteered) || 0) + totalHours
            await volunteer.update({ total_hours_volunteered: addTotalHours })
            await volunteer.save()

            console.log({ success: true, message: 'Your volunteer hours is successfully added', data: addTotalHours })
            return true
        }


    } catch (error) {
        console.log('calculate hour service failed: ', error.message)
    }
}