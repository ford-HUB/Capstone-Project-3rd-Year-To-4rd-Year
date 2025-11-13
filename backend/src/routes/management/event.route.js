import express from "express"


// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { registerEvent, unregisterEvent } from "../../controllers/management/event.controller.js"

const managementEvent = express.Router()

managementEvent.post('/register-event/:event_id', guard('staff', 'coordinator', 'assistant_coordinator'), registerEvent)
managementEvent.delete('/unregister-event/:event_id', guard('staff', 'coordinator', 'assistant_coordinator'), unregisterEvent)

managementEvent.get('/testing', (req, res) => {
    res.send("routes working")
})

export default managementEvent