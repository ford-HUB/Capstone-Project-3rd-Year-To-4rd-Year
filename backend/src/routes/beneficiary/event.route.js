import express from "express";
import { guard } from "../../middleware/guard.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { beneficiaryEventRegistrationSchema } from "../../validators/beneficiary.validator.js";
import { idVerificationUpload } from "../../middleware/cloudinaryUpload.js";

// Controllers
import {
    getBeneficiaryMatchedEvents,
    registerBeneficiaryForEvent,
    cancelBeneficiaryRegistration,
    getBeneficiaryRegisteredEvents,
    getBeneficiaryPendingRegistrations,
    refreshBeneficiaryMatches,
    getBeneficiaryAttendanceRecords,
    getBeneficiaryCompletedRegisteredAttendanceRecords,
    getBeneficiaryParticipationHistory
} from "../../controllers/beneficiary/event.controller.js";

const eventRouter = express.Router();

// Routes
eventRouter.get('/matched-events', guard('beneficiary'), getBeneficiaryMatchedEvents);
eventRouter.post('/register/:eventId', guard('beneficiary'), idVerificationUpload.array('id_files', 5), validateRequest(beneficiaryEventRegistrationSchema), registerBeneficiaryForEvent);
eventRouter.delete('/cancel/:eventId', guard('beneficiary'), cancelBeneficiaryRegistration);
eventRouter.get('/registered-events', guard('beneficiary'), getBeneficiaryRegisteredEvents);
eventRouter.get('/pending-registrations', guard('beneficiary'), getBeneficiaryPendingRegistrations);
eventRouter.get('/attendance-records', guard('beneficiary'), getBeneficiaryAttendanceRecords);
eventRouter.get('/completed-attendance-records', guard('beneficiary'), getBeneficiaryCompletedRegisteredAttendanceRecords);
eventRouter.get('/participation-history', guard('beneficiary'), getBeneficiaryParticipationHistory);
eventRouter.post('/refresh-matches', guard('beneficiary'), refreshBeneficiaryMatches);

export default eventRouter;
