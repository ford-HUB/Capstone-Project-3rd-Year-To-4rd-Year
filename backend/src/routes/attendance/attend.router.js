import express from "express"

// @ User Schema

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { createScannedAttendance, generateQR } from "../../controllers/attendance/attend.controller.js"

const attendRouter = express.Router()

attendRouter.get('/attendance/:type', guard('student'), createScannedAttendance)
attendRouter.get('/generateQRCODE', generateQR)

attendRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default attendRouter