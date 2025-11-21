import express from "express";
import { guard } from "../../middleware/guard.js";
import { getMyActivityLogs } from "../../controllers/beneficiary/activityLog.controller.js";

const activityLogRouter = express.Router();

activityLogRouter.get('/my-logs', guard('beneficiary'), getMyActivityLogs);

export default activityLogRouter;

