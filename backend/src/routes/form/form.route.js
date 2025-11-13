import express from "express";

// @ Controllers
import {
    createForm,
    getForms,
    getFormById,
    updateForm,
    deleteForm,
    submitFormResponse,
    getFormResponses,
    getCategories,
    getFormsForReflection,
    submitMultipleFormResponses
} from "../../controllers/form/form.controller.js";
import { getEvents } from "../../controllers/event/event.controller.js";

// @ Middleware
import { guard } from "../../middleware/guard.js";

const formRouter = express.Router();

// Public routes (no authentication required)
formRouter.get("/categories", getCategories);
formRouter.get("/events", getEvents);
formRouter.get("/reflection", getFormsForReflection); // New endpoint for dynamic form reflection
formRouter.get("/:form_id", getFormById);
formRouter.post("/:form_id/submit", guard('volunteer', 'beneficiary'), submitFormResponse);
formRouter.post("/submit-multiple", submitMultipleFormResponses);

// Form management routes (director/staff/coordinator only)
formRouter.post("/", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), createForm);
formRouter.get("/", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), getForms);
formRouter.put("/:form_id", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), updateForm);
formRouter.delete("/:form_id", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), deleteForm);

// Form responses (director/staff/coordinator only)
formRouter.get("/:form_id/responses", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), getFormResponses);

formRouter.get("/testing", (req, res) => {
    res.send("form routes working")
});

export default formRouter;
