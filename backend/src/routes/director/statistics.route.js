import express from "express";

// @ Middleware
import { guard } from "../../middleware/guard.js";
import { jwtAuthenticate } from "../../middleware/authentication.js";
import { updateUserActivity } from "../../middleware/updateActivity.js";

// @ Controllers
import { getComprehensiveStats, getOverviewStats } from "../../controllers/director/statistics.controller.js";

const statisticsRouter = express.Router();

// Get comprehensive statistics (Director only)
statisticsRouter.get('/comprehensive', guard('director'), getComprehensiveStats);

// Get overview statistics (Authenticated users)
statisticsRouter.get('/overview', jwtAuthenticate, updateUserActivity, getOverviewStats);

export default statisticsRouter;

