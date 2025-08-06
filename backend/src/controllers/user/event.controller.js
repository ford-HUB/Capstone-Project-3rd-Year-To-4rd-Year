import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { matchInterestedEvents } from "../ai/match.controller.js"

export const addInterest = async (req, res) => {
    const t = await db.transaction()
    try {
        const account = req.user

        const { interest } = req.validatedBody

        const { Student, StudentDepartment, Course, YearLevel, Volunteer } = models

        const studentValid = await Student.findOne({ where: { account_id: account.account_id } })

        if (!studentValid) { return t.rollback(), res.json({ message: 'student not found' }) }

        const existingVolunteer = await Volunteer.findOne({ where: { student_id: studentValid.student_id } })

        if (existingVolunteer) {
            await existingVolunteer.update({ interested_events: interest }, { transaction: t })
        } else {
            await Volunteer.create({
                student_id: studentValid.student_id,
                department_id: studentValid.department_id,
                course_id: studentValid.course_id,
                yl_id: studentValid.yl_id,
                interested_events: interest
            }, { transaction: t })
        }

        await t.commit()
        res.json({ success: true, message: 'Successfully Added Interests' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}

export const updateInterest = async (req, res) => {
    const t = await db.transaction()
    try {
        const account = req.user

        const { interest } = req.validatedBody

        const { Student, StudentDepartment, Course, YearLevel, Volunteer } = models

        const studentValid = await Student.findOne({
            where: { account_id: account.account_id },
            include: [
                { model: Course },
                { model: YearLevel },
            ]
        })

        if (!studentValid) { return t.rollback(), res.json({ message: 'student not found' }) }

        const existingVolunteer = await Volunteer.findOne({ where: { student_id: studentValid.student_id } })

        if (existingVolunteer) {
            await existingVolunteer.update({ interested_events: interest }, { transaction: t })
        } else {
            const department = await StudentDepartment.findOne({ where: { student_id: studentValid.student_id } })
            await Volunteer.create({
                student_id: studentValid.student_id,
                department_id: department.department_id,
                course_id: studentValid.Course.course_id,
                yl_id: studentValid.YearLevel.yl_id,
                interested_events: interest
            }, { transaction: t })
        }

        await t.commit()
        res.json({ success: true, message: 'Successfully Added Interests' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}

export const checkInterest = async (req, res) => {
    try {
        const user = req.user;

        const { Student, Volunteer } = models;
        const student = await Student.findOne({
            where: { account_id: user.account_id }
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found', hasInterests: false });
        }

        const volunteer = await Volunteer.findOne({
            where: { student_id: student.student_id },
            attributes: ['interested_events']
        });

        if (!volunteer) {
            return res.json({ success: true, hasInterests: false, interests: [] })
        }

        // Check if interests exist and are not empty
        const hasInterests = volunteer.interested_events && volunteer.interested_events.length > 0

        return res.json({ success: true, hasInterest: hasInterests, interest: volunteer.interested_events || [] });

    } catch (error) {
        console.log('check interest controller failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error', hasInterests: false });
    }
}

export const getMatchedEvents = async (req, res) => {  // Modifcation is almost everything
    try {
        const user = req.user

        const {
            Volunteer,
            Event,
            Student,
            Department,
            Course,
            YearLevel,
            Category,
            Organizer
        } = models

        const student = await Student.findOne({ where: { account_id: user.account_id } })

        const isInterestExist = await Volunteer.findOne({ where: { student_id: student.student_id } })

        if (!isInterestExist.interested_events || isInterestExist.length === 0) { return res.json({ message: 'must complete your profile info' }) }

        if (!isInterestExist) { return res.json({ message: 'student not found' }) }

        const volunteer = await Volunteer.findOne({
            where: { student_id: isInterestExist.student_id },
            include: [
                { model: Student },
                { model: Department },
                { model: Course },
                { model: YearLevel }
            ]
        })

        const events = await Event.findAll({
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    through: { attributes: [] }
                },
                {
                    model: Organizer
                }
            ]
        })

        if (events.length < 0) { return res.json({ message: 'event currently empty' }) }

        const formatEvents = events.map(evt => ({
            event_id: evt.event_id,
            title: evt.title,
            description: evt.description,
            categories: evt.Categories.map(cat => cat.name) || []
        }))

        console.log(volunteer.interested_events)

        const response_ai = await matchInterestedEvents(volunteer.interested_events, formatEvents)

        if (!Array.isArray(response_ai) || response_ai.length === 0) {
            return res.json({ message: 'No matched events found' })
        }

        const matchedEvents = await Event.findAll({
            where: { event_id: response_ai },
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    through: { attributes: [] }
                },
                {
                    model: Organizer
                }
            ]
        })

        console.log(matchedEvents)

        res.json({ success: true, matched: matchedEvents })

    } catch (error) {
        res.json({ message: 'Internal Server Error' })
        console.log(' get match events failed', error.message)
    }
}

export const register_event = async (req, res) => {
    const t = await db.transaction()
    try {
        const event_id = req.params.eventId
        const user = req.user

        const { notes } = req.validatedBody

        console.log(notes)

        if (event_id === 0 || event_id === null) { return res.json({ message: 'event id is not provided' }) }

        const { Volunteer, Student, EventRegistration, Event } = models

        const isStudentExist = await Student.findOne({ where: { account_id: user.account_id } })
        if (!isStudentExist) { await t.rollback(); return res.json({ message: 'student not found' }) }


        const isVolunteerExist = await Volunteer.findOne({ where: { student_id: isStudentExist.student_id } })
        if (!isVolunteerExist) { await t.rollback(); return res.json({ message: 'your volunteer info is not found' }) }

        const existingRegistration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                volunteer_id: isVolunteerExist.volunteer_id
            },
            transaction: t
        })

        if (existingRegistration) {
            await t.rollback()
            return res.json({ message: 'Already registered for this event' })
        }

        await EventRegistration.create({
            event_id: event_id,
            volunteer_id: isVolunteerExist.volunteer_id,
            registration_date: new Date(),
            status: 'registered',
            notes: notes
        }, { transaction: t })

        await Event.update(
            { participants: db.literal('participants + 1') },
            { where: { event_id: event_id }, transaction: t }
        )

        await t.commit()

        res.json({ success: true, message: 'You Successfully Registered an Event' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}







