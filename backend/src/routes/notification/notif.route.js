import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"


// @ Controllers
import { getNotificationList, markNotificationAsRead } from "../../controllers/notification/notif.controller.js"

const notificationRouter = express.Router()

notificationRouter.get('/list', guard('student', 'volunteer', 'director', 'coordinator', 'staff', 'assistant_coordinator'), getNotificationList)

notificationRouter.put('/mark-as-read/:notificationId', guard('student', 'volunteer', 'director', 'coordinator', 'assistant_coordinator', 'staff'), markNotificationAsRead)


notificationRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default notificationRouter