import express from "express";

// @ Middleware
import { guard } from "../../middleware/guard.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";

// @ Controllers
import {
    getDonationList,
    getDonationStats,
    getDashboardStats,
    getOpenDonationEvents,
    updateDonationStatus,
    bulkUpdateDonationStatus,
    exportDonations,
    getDonationDetails
} from "../../controllers/director/donationTracking.controller.js";

// @ Validators
import { updateDonationStatusSchema, bulkUpdateDonationStatusSchema, exportDonationsSchema } from "../../validators/donationTracking.validator.js";

const donationTrackingRouter = express.Router();

// Get donation list with filters
donationTrackingRouter.get('/list', guard('director'), getDonationList);

// Get donation statistics
donationTrackingRouter.get('/stats', guard('director'), getDonationStats);

// Get events open for donations
donationTrackingRouter.get('/open-events', guard('director'), getOpenDonationEvents);

// Get dashboard statistics
donationTrackingRouter.get('/dashboard', guard('director'), getDashboardStats);

// Get donation details
donationTrackingRouter.get('/:donationId', guard('director'), getDonationDetails);

// Update donation status
donationTrackingRouter.put('/:donationId/status', guard('director'), validateRequest(updateDonationStatusSchema), updateDonationStatus);

// Bulk update donation status
donationTrackingRouter.put('/bulk-status', guard('director'), validateRequest(bulkUpdateDonationStatusSchema), bulkUpdateDonationStatus);

// Export donations
donationTrackingRouter.post('/export', guard('director'), validateRequest(exportDonationsSchema), exportDonations);

export default donationTrackingRouter;
