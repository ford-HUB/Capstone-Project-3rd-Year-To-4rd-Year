import QRCode from 'qrcode'
import { db } from "../../config/db.js";
import models from "../../models/index.js";

export const createScannedAttendance = async (req, res) => {
    try {
        const { type } = req.params
        const { eventId } = req.query
        const accountId = req.user.account_id

        const { Attendance, Student, Volunteer, EventRegistration } = models
        if(!['in', 'out'].includes(type)) { return res.json({ message: 'invalid attendance type' }) }

        const student = await Student.findOne({ where: { account_id: accountId } })
        const volunteer = await Volunteer.findOne({ where: { student_id: student.student_id } })
        const now = new Date()

        const isRegistered = await EventRegistration.findOne({ where: { event_id: eventId, volunteer_id: volunteer.volunteer_id } })
        if(!isRegistered) { return res.json({ message: 'sorry, you are not registered from this event' }) }

        let attendace = await Attendance.findOne({ where: { volunteer_id: volunteer.volunteer_id, event_id: eventId } })

        if(!attendace) {
            attendace = await Attendance.create({
                volunteer_id: volunteer.volunteer_id,
                event_id: eventId,
                time_in: type === 'in' ? now : null,
                time_out: type === 'out' ? now : null
            })
        }else {
            if(type === 'in' && attendace.time_in) {
                return res.json({ message: 'you already done your attendance time-in' })
            }

            if(type === 'out' && attendace.time_out) {
                return res.json({ message: 'you already done your attendance time-out' })
            }

            await Attendance.update({
                time_in: type === 'in' ? now : attendace.time_inm,
                time_out: type === 'out' ? now : attendace.time_out
            })
        }

        return res.json({ success: true, message: `you successfully ${type}` })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('attend of attendace')
    }
}

export const generateQR = async (req, res) => {
    try {
        const { type, eventId } = req.query
        if(!['in', 'out'].includes(type)) { return res.json({ message: 'invalid attendance type' }) }

        const scanURL = `http://localhost:${process.env.PORT}/attendance/${type}?eventId=${eventId}`
        const qrGeneratedURL = await QRCode.toDataURL(scanURL)
        return res.json({ success: true, qrcode: qrGeneratedURL })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log('generate qr code failed: ', error.message)
    }
}