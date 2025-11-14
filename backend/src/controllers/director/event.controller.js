import { db } from "../../config/db.js";
import models from '../../models/index.js'

export const registerEvent = async (req, res) => {
    const t = await db.transaction()
    try {
        const { event_id } = req.params
        const accountId = req.user.account_id

        
        const { EventRegistration, Event, Director } = models

        const selectedEvent = await Event.findByPk(event_id)
        if(!selectedEvent) { 
            await t.rollback()
            return res.json({ message: 'Event not found' }) 
        }

        if (new Date(selectedEvent.event_started) <= new Date()) { 
            await t.rollback()
            return res.json({ message: 'Event is already started.' }) 
        }
        if (new Date(selectedEvent.event_ended) <= new Date()) { 
            await t.rollback()
            return res.json({ message: 'Event is already ended.' }) 
        }

        const director = await Director.findOne({ where: { account_id: accountId } })
        if(!director) { 
            await t.rollback()
            return res.json({ message: 'Please update your profile first' }) 
        }

        const isExist = await EventRegistration.findOne({ where: { event_id: event_id, participant_id: director.director_id, participant_type: 'director' } })

        if(isExist) { 
            await t.rollback()
            return res.json({ message: 'You already register in the event' }) 
        }

        const conflictingRegistrations = await EventRegistration.findAll({
            where: { 
                participant_id: director.director_id,
                participant_type: 'director'
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
            return res.json({ message: 'You selected event is conflict to other event you registered today!' }) 
        }


        const newRegister = await EventRegistration.create({
            event_id,
            participant_id: director.director_id,
            participant_type: 'director',
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
        console.log('Join Event controller failed :', error.message)
        res.json({ message: 'Internal Server Error' })
    }
}

export const unregisterEvent = async (req, res) => {
    try {
        const { event_id } = req.params

        const { Director, EventRegistration, Event } = models

        const event = await Event.findByPk(event_id)
        if(!event) { return res.json({ message: 'event not found' }) }

        const director = await Director.findOne({ where: { account_id: req.user.account_id } })
        if(!director) { return res.json({ message: 'Your info not found' }) }

        const destroyData = await EventRegistration.destroy({ 
            where: {
                event_id: event.event_id,
                participant_id: director.director_id,
                status: 'registered'
            }
        })

        if(!destroyData) { return res.json({ message: 'Your registration failed to destroy' }) }
        
        return res.json({ success: true, message: 'You are no longer registered for this event' })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('unregister event failed: ', error.message)
    }
}


