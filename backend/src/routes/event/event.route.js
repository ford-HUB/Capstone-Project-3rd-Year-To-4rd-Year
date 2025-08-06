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
import { addEvent, listEvent, updateEvent, destroyEvents, destroyEventId } from "../../controllers/event/event.controller.js"

const eventRouter = express.Router()

eventRouter.post('/add-event', upload.single('event_image'), guard(...allowedRoleManageEvent), validateRequest(eventSchema), addEvent)
eventRouter.get('/list-event', guard(...allowedRoleManageEvent), listEvent)
eventRouter.put('/update-event/:id', upload.single('event_image'), validateRequest(eventSchema), guard(...allowedRoleManageEvent), updateEvent)
eventRouter.delete('/delete-event/:id', guard(...allowedRoleManageEvent), destroyEventId)
eventRouter.delete('/delete-all-events', guard(...allowedRoleManageEvent), destroyEvents)


eventRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default eventRouter