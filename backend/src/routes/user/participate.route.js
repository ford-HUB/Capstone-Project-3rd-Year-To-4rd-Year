import express from "express"

// @ User Schema
import { register_eventSchema } from "../../validators/event.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRole } from "../../static/allowedStaffRole.js"

// @ Controllers
import { register_event } from "../../controllers/user/event.controller.js"

const participateRouter = express.Router()

participateRouter.post('/register-event/:eventId', guard(...allowedRole), validateRequest(register_eventSchema), register_event)

participateRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default participateRouter