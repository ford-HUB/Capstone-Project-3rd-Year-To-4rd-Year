import express from "express"
import models from "../../models/index.js"
import { Op } from "sequelize"

// @ User Schema
import { register_eventSchema } from "../../validators/event.validator.js"
import { eventRegistrationSchema } from "../../validators/user.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRole } from "../../static/allowedStaffRole.js"

// @ Controllers
import { cancel_registration, event_registration, get_all_events_calendar, get_all_registered_events, register_event } from "../../controllers/user/event.controller.js"
import { getParticipationHistory } from "../../controllers/user/participationHistory.controller.js"

const participateRouter = express.Router()

participateRouter.post('/register-event/:eventId', guard('student'), validateRequest(register_eventSchema), register_event)
participateRouter.post('/event-registration/:event_id', guard('student'), validateRequest(eventRegistrationSchema), event_registration)
participateRouter.delete('/event-cancellation/:event_id', guard('student'), cancel_registration)
participateRouter.get('/get-all-registered-events', guard('student'), get_all_registered_events)
participateRouter.get('/participation-history', guard('student'), getParticipationHistory)
participateRouter.get('/event-calendar', guard('student'), get_all_events_calendar)

participateRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

// Test endpoint for calendar without authentication
participateRouter.get('/test-calendar', async (req, res) => {
    try {
        const { Event, Category } = models
        
        const eventData = await Event.findAll({
            where: {
                status: { [Op.ne]: 'Completed' }
            },
            attributes: [
                'event_id', 'title', 'event_started'
            ],
            include: [
                { model: Category, through: { attributes: [] } }
            ],
            limit: 5
        })

        const eventPayload = eventData.map(event => ({
           title: event.title,
           time: event.event_started,
           type: event.Categories[0]?.name || 'General',
        }))

        return res.json({ success: true, eventData: eventPayload })
    } catch (error) {
        res.json({ success: false, message: 'Test failed', error: error.message })
    }
})

export default participateRouter