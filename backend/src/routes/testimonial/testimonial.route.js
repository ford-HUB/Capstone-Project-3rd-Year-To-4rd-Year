import express from "express";
import { guard } from "../../middleware/guard.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createTestimonialSchema } from "../../validators/testimonial.validator.js";
import { createTestimonial, getTestimonials, getPendingTestimonials, getAllApprovedTestimonials, approveTestimonial, deleteTestimonial, toggleFeatured, getBeneficiariesServedCount } from "../../controllers/testimonial/testimonial.controller.js";

const testimonialRouter = express.Router();

// Beneficiary routes
testimonialRouter.post('/create', guard('beneficiary'), validateRequest(createTestimonialSchema), createTestimonial);

// Public
testimonialRouter.get('/', getTestimonials);
testimonialRouter.get('/statistics/beneficiaries-served', getBeneficiariesServedCount);

// Director routes
testimonialRouter.get('/pending', guard('director'), getPendingTestimonials);
testimonialRouter.get('/all', guard('director'), getAllApprovedTestimonials);
testimonialRouter.patch('/:testimonial_id/approve', guard('director'), approveTestimonial);
testimonialRouter.patch('/:testimonial_id/featured', guard('director'), toggleFeatured);
testimonialRouter.delete('/:testimonial_id', guard('director'), deleteTestimonial);

export default testimonialRouter;

