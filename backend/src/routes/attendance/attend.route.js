import express from "express"


// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ScanQRAttendance, generateBothQR, attendanceLog, attendanceRecords, attendanceStatistics } from "../../controllers/attendance/attend.controller.js"

const attendRouter = express.Router()

attendRouter.get('/scanQr/attendance', guard('volunteer', 'director', 'staff', 'coordinator', 'assistant_coordinator', 'beneficiary'), ScanQRAttendance)
attendRouter.get('/attendance-log', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), attendanceLog)
attendRouter.get('/attendance-records', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), attendanceRecords)
attendRouter.get('/attendance-statistics', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), attendanceStatistics)
attendRouter.get('/generateBothQRCODE', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), generateBothQR)

attendRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default attendRouter