import express from "express";
import { guard } from "../../middleware/guard.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createTestimonialSchema } from "../../validators/testimonial.validator.js";
import { createTestimonial, getTestimonials } from "../../controllers/testimonial/testimonial.controller.js";

const testimonialRouter = express.Router();

// Beneficiary routes
testimonialRouter.post('/create', guard('beneficiary'), validateRequest(createTestimonialSchema), createTestimonial);

// Public/Admin routes
testimonialRouter.get('/', getTestimonials);

export default testimonialRouter;

