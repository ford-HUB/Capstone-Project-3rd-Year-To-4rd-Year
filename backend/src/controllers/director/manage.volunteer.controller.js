import { db } from "../../config/db.js";
import models from "../../models/index.js";

export const ListVolunteers = async (req, res) => {
    try {
        const { Student, Volunteer, EventRegistration, Event, EventCategory, EventDepartment, Department } = models;

        const getList = await Volunteer.findAll({
            attributes: ['volunteer_id'],
            include: [
                {
                    model: Student,
                    attributes: ['firstname', 'lastname', 'phone_number'],
                    include: [
                        {   
                            model: Department,
                            attributes: ['department_id', 'department_name']
                        },
                    ],    
                },

                {
                    model: EventRegistration,
                    attributes: ['event_registration_id', 'status'],
                    include: [
                        {
                            model: Event,
                            attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location', 'status'],
                        }
                    ]
                }
            ],

            order: [['volunteer_id', 'ASC']],
            raw: true,
            nest: true
        })

        if (getList.length === 0) { return res.json({ message: 'List Currently Empty' }) }

        const transformedList = getList.map(volunteer => {
            const volunteerData = {
                id: volunteer.volunteer_id,
                student: {
                    firstname: volunteer['Student.firstname'],
                    lastname: volunteer['Student.lastname'],
                    phone_number: volunteer['Student.phone_number'],
                    department: volunteer['Student.Department.department_name']
                },
                eventRegistrations: volunteer.EventRegistrations.map(registration => ({
                    id: registration.event_registration_id,
                    status: registration.status,
                    event: {
                        id: registration.Event.event_id,
                        title: registration.Event.title,
                        event_started: registration.Event.event_started,
                        event_ended: registration.Event.event_ended,
                        location: registration.Event.location,
                        status: registration.Event.status
                    }
                }))
            }

            return volunteerData;
        })

        return res.json({ success: true,  list: transformedList });

    } catch (error) {
        res.json({ message: "Internal server error" })
        console.log("List volunteers failed: ", error.message)
    }
}