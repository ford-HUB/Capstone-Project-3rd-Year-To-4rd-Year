import express from "express";
import { guard } from "../../middleware/guard.js";
import { getMyActivityLogs } from "../../controllers/donor/activityLog.controller.js";

const activityLogRouter = express.Router();

activityLogRouter.get('/my-logs', ...guard('donor'), getMyActivityLogs);

export default activityLogRouter;

