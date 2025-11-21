import express from "express";

// @ Middleware
import { guard } from "../../middleware/guard.js";

// @ Controllers
import { getMyActivityLogs } from "../../controllers/director/activityLog.controller.js";

const activityLogRouter = express.Router();

activityLogRouter.get('/my-logs', guard('director'), getMyActivityLogs);

export default activityLogRouter;
