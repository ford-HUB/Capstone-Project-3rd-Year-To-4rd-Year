import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ListVolunteers } from "../../controllers/director/manage.volunteer.controller.js"

const manageVolunteerRouter = express.Router()

manageVolunteerRouter.get('/list-volunteer', guard('director', 'staff', 'coordinator'), ListVolunteers)

manageVolunteerRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default manageVolunteerRouter