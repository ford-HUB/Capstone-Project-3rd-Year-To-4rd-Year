import express from "express";
import { guard } from "../../middleware/guard.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createTestimonialSchema } from "../../validators/testimonial.validator.js";
import { createTestimonial, getTestimonials, getPendingTestimonials, approveTestimonial } from "../../controllers/testimonial/testimonial.controller.js";

const testimonialRouter = express.Router();

// Beneficiary routes
testimonialRouter.post('/create', guard('beneficiary'), validateRequest(createTestimonialSchema), createTestimonial);

// Public/Admin routes
testimonialRouter.get('/', getTestimonials);

// Director routes
testimonialRouter.get('/pending', guard('director'), getPendingTestimonials);
testimonialRouter.patch('/:testimonial_id/approve', guard('director'), approveTestimonial);

export default testimonialRouter;

