import express from "express"

// @ User Schema
import { eventSchema } from "../../validators/event.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRoleManageEvent } from "../../static/allowedStaffRole.js"

// @ upload file
import { upload } from "../../middleware/cloudinaryUpload.js"

// @ Controllers
import { addEvent, listEvent, getParticipantEvent, updateEvent, destroyEvents, destroyEventId, getEventUserStatus, getRegisteredParticipantCount, removeEventRegistration } from "../../controllers/event/event.controller.js"

const eventRouter = express.Router()

eventRouter.post('/add-event',  guard('director', 'staff', 'coordinator', 'assistant_coordinator'), upload.single('event_image'), validateRequest(eventSchema), addEvent)
eventRouter.get('/list-event', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), listEvent)
eventRouter.get('/get-participants/:event_id', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), getParticipantEvent) 
eventRouter.get('/get-event-user-status/:event_id', guard('director', 'staff', 'coordinator', 'volunteer', 'assistant_coordinator'), getEventUserStatus)
eventRouter.get('/get-event-participant-count/:event_id', guard('volunteer'), getRegisteredParticipantCount)
eventRouter.put('/update-event/:id',  guard('director', 'staff', 'coordinator', 'assistant_coordinator'), upload.single('event_image'), validateRequest(eventSchema), updateEvent)
eventRouter.delete('/delete-event/:id', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), destroyEventId)
eventRouter.delete('/delete-all-events', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), destroyEvents)
eventRouter.delete('/remove-registration/:registration_id', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), removeEventRegistration)


eventRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default eventRouter