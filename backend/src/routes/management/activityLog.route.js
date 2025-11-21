import express from "express";

// @ Middleware
import { guard } from "../../middleware/guard.js";

// @ Controllers
import { getMyActivityLogs } from "../../controllers/management/activityLog.controller.js";

const activityLogRouter = express.Router();

activityLogRouter.get('/my-logs', guard('staff', 'coordinator', 'assistant_coordinator'), getMyActivityLogs);

export default activityLogRouter;

