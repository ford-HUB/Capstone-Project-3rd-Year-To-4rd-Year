import express from "express";
import { guard } from "../../middleware/guard.js";
import { getSystemPerformance, getPerformanceHistory } from "../../controllers/director/systemPerformance.controller.js";

const systemPerformanceRouter = express.Router();

// Get real-time system performance metrics
systemPerformanceRouter.get('/metrics', guard('director'), getSystemPerformance);

// Get performance history data
systemPerformanceRouter.get('/history', guard('director'), getPerformanceHistory);

export default systemPerformanceRouter;
