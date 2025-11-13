import express from "express";

// @ Controllers
import {
    getEvents,
    getEventFormLinkStatus,
    submitEventGoogleFormLink,
    getGoogleFormLinks,
    getGoogleFormLinkById,
    updateGoogleFormLink,
    deleteGoogleFormLink
} from "../../../controllers/form/v2/form.controller.js";

// @ Middleware
import { guard } from "../../../middleware/guard.js";
import { validateRequest } from "../../../middleware/validateRequest.middleware.js";

// @ Validators
import { 
    submitFormLinkSchema, 
    updateFormLinkSchema,
    getGoogleFormLinksQuerySchema 
} from "../../../validators/form.validator.js";

const formV2Router = express.Router();

// Public routes (no authentication required)
formV2Router.get("/events", getEvents);
formV2Router.get("/event/:event_id/form-status", getEventFormLinkStatus);

// Protected routes
formV2Router.post("/submit-google-form", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), validateRequest(submitFormLinkSchema), submitEventGoogleFormLink);

// Google Form Links management routes
formV2Router.get("/google-form-links", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), validateRequest(getGoogleFormLinksQuerySchema, 'query'), getGoogleFormLinks);
formV2Router.get("/google-form-links/:formlink_id", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), getGoogleFormLinkById);
formV2Router.put("/google-form-links/:formlink_id", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), validateRequest(updateFormLinkSchema), updateGoogleFormLink);
formV2Router.delete("/google-form-links/:formlink_id", guard('director', 'staff', 'coordinator', 'assistant_coordinator'), deleteGoogleFormLink);

export default formV2Router;
