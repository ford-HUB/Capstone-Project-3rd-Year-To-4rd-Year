import express from "express";

// @ Middleware
import { guard } from "../../middleware/guard.js";

// @ Controllers
import { getMyActivityLogs } from "../../controllers/user/activityLog.controller.js";

const activityLogRouter = express.Router();

activityLogRouter.get('/my-logs', guard('volunteer'), getMyActivityLogs);

export default activityLogRouter;

