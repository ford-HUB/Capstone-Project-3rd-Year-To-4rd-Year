import express from "express";
import { guard } from "../../middleware/guard.js";
import { getDepartmentOverview, getStaffOverview } from "../../controllers/management/overview.controller.js";

const overviewRouter = express.Router();

// Get system overview for staff
overviewRouter.get(
    '/staff-overview',
    guard('staff'),
    getStaffOverview
);

// Get department overview for coordinator and assistant coordinator
overviewRouter.get(
    '/department-overview',
    guard('coordinator', 'assistant_coordinator'),
    getDepartmentOverview
);

export default overviewRouter;

