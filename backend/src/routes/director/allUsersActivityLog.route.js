import express from "express";
import { guard } from "../../middleware/guard.js";
import { getAllUsersActivityLogs } from "../../controllers/director/allUsersActivityLog.controller.js";

const allUsersActivityLogRouter = express.Router();

allUsersActivityLogRouter.get('/recorded', ...guard('director'), getAllUsersActivityLogs);

export default allUsersActivityLogRouter;

