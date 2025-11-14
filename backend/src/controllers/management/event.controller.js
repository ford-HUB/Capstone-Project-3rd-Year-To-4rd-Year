import { db } from "../../config/db.js";
import models from "../../models/index.js";

export const registerEvent = async (req, res) => {
    const t = await db.transaction()
    try {
        const { event_id } = req.params
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const { EventRegistration, Event, Staff, Coordinator, Director } = models

        const selectedEvent = await Event.findByPk(event_id)
        if(!selectedEvent) { 
            await t.rollback()
            return res.json({ message: 'event not found' }) 
        }

        if (new Date(selectedEvent.event_started) <= new Date()) { 
            await t.rollback()
            return res.json({ message: 'Event is already started.' }) 
        }
        if (new Date(selectedEvent.event_ended) <= new Date()) { 
            await t.rollback()
            return res.json({ message: 'Event is already ended.' }) 
        }


        let payload_id
        let payload = {}

        switch(roleType) {
            case 'staff':
                payload = await Staff.findOne({ where: { account_id: accountId } })
                payload_id = payload.staff_id
                break
            case 'director':
                payload = await Director.findOne({ where: { account_id: accountId } })
                payload_id = payload.director_id
                break
            case 'coordinator':
            case 'assistant_coordinator':
                payload = await Coordinator.findOne({ where: { account_id: accountId } })
                payload_id = payload.coordinator_id
                break
            default:
                console.log('role type is out of our scope')
                break
        }

        if(!payload) { 
            await t.rollback()
            return res.json({ message: 'please update your profile first' }) 
        }

        const isExist = await EventRegistration.findOne({ where: { event_id: event_id, participant_id: payload_id, participant_type: roleType === 'staff' ? 'staff' : roleType === 'director' ? 'director' : roleType === 'coordinator' ? 'coordinator' : roleType === 'assistant_coordinator' ? 'assistant_coordinator': 'unauthorized' } })

        if(isExist) { 
            await t.rollback()
            return res.json({ message: 'you already register in the event' }) 
        }

        const conflictingRegistrations = await EventRegistration.findAll({
            where: { 
                participant_id: payload_id,
                participant_type: roleType === 'staff' ? 'staff' : roleType === 'director' ? 'director' : roleType === 'coordinator' ? 'coordinator' : roleType === 'assistant_coordinator' ? 'assistant_coordinator': 'unauthorized'
            },
            include: [{
                model: Event,
                where: {
                    event_started: selectedEvent.event_started
                }
            }]
        })
        
        if(conflictingRegistrations.length > 0) { 
            await t.rollback()
            return res.json({ message: 'you selected event is conflict to other event you registered today' }) 
        }

        const newRegister = await EventRegistration.create({
            event_id,
            participant_id: payload_id,
            participant_type: roleType === 'staff' ? 'staff' : roleType === 'director' ? 'director' : roleType === 'coordinator' ? 'coordinator' : roleType === 'assistant_coordinator' ? 'assistant_coordinator': 'unauthorized',
            registration_date: new Date(),
            status: 'registered',
            notes: 'not applicable',
        }, { transaction: t })

        if(!newRegister) { 
            await t.rollback()
            return res.json({ message: 'register failed' }) 
        }

        await t.commit()
        return res.json({ success: true, message: 'You register successfully' })

    } catch (error) {
        await t.rollback()
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('register event controller failed: ', error.message)
    }
}

export const unregisterEvent = async (req, res) => {
    try {
        const { event_id } = req.params
        const roleType = req.user.Role.name

        const { Staff, Coordinator, Director, EventRegistration, Event } = models

        const event = await Event.findByPk(event_id)
        if (!event) { return res.json({ message: 'Event not found' }) }

        let participant_id

        switch (roleType) {
            case 'staff': 
                const staff = await Staff.findOne({ where: { account_id: req.user.account_id } })
                participant_id = staff.staff_id
                break
            case 'director':
                const director = await Director.findOne({ where: { account_id: req.user.account_id } })
                participant_id = director.director_id
                break

            case 'assistant_coordinator':
            case 'coordinator': 
                const coordinator = await Coordinator.findOne({ where: { account_id: req.user.account_id } })
                participant_id = coordinator.coordinator_id
                break
    
            default:
                return res.json({ message: 'Unauthorized role' })
        }

        const destroyData = await EventRegistration.destroy({
            where: {
                event_id: event.event_id,
                participant_id: participant_id,
                participant_type: roleType,
                status: 'registered'
            }
        })

        if (!destroyData) { return res.json({ message: 'Your registration failed to destroy' }) }

        return res.json({ success: true, message: 'You are no longer registered for this event' })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('unregister event failed: ', error.message)
    }
}