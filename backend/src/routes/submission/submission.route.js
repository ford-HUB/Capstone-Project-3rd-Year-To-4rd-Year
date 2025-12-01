import express from "express";

// @ Controllers
import {
    getAllDocumentsAsSubmissions,
    getAllDepartments,
    getAllGraduatedYears
} from "../../controllers/submission/submission.controller.js";

// @ Validators
import {
    submissionFilterSchema
} from "../../validators/submission.validator.js";

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { guard } from "../../middleware/guard.js";

const submissionRouter = express.Router();

submissionRouter.get("/all-documents", guard("staff", "coordinator", "assistant_coordinator", "director"), validateRequest(submissionFilterSchema), getAllDocumentsAsSubmissions);

submissionRouter.get("/departments", guard("staff", "coordinator", "assistant_coordinator", "director"), getAllDepartments);

submissionRouter.get("/graduated-years", guard("staff", "coordinator", "assistant_coordinator", "director"), getAllGraduatedYears);

export default submissionRouter;
