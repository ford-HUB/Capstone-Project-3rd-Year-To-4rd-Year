import express from "express"

// @ User Schema

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { getMatchedEvents } from "../../controllers/user/event.controller.js"

const matchRouter = express.Router()

matchRouter.get('/matched-events', guard('volunteer'), getMatchedEvents)

matchRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default matchRouter