import Joi from 'joi';

export const createTestimonialSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        "any.required": "Rating is required.",
        "number.base": "Rating must be a number.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating must not exceed 5."
    }),

    message: Joi.string()
        .min(1)
        .min(10)
        .max(1000)
        .required()
        .messages({
            "any.required": "Message is required.",
            "string.empty": "Message cannot be empty.",
            "string.min": "Message must be at least 10 characters.",
            "string.max": "Message must not exceed 1000 characters."
        })
});

