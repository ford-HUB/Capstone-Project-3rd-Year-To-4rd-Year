import Joi from 'joi';

export const createTestimonialSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        "any.required": "Rating is required.",
        "number.base": "Rating must be a number.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating must not exceed 5."
    }),

    role: Joi.string().required().messages({
        "any.required": "Role is required.",
        "string.empty": "Role cannot be empty."
    }),

    initials: Joi.string().allow("").optional()
});

