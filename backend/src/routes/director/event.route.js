import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { registerEvent, unregisterEvent } from "../../controllers/director/event.controller.js"

const registerEventRouter = express.Router()

registerEventRouter.post('/register-event/:event_id', guard('director'), registerEvent)
registerEventRouter.delete('/unregister-event/:event_id', guard('director'), unregisterEvent)

registerEventRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default registerEventRouter