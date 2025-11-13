import Joi from 'joi';

export const beneficiaryEventEvaluationSchema = Joi.object({
    overallRating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Overall rating is required.",
      "number.base": "Overall rating must be a number.",
      "number.min": "Overall rating must be at least 1.",
      "number.max": "Overall rating must not exceed 5."
    }),
  
    eventOrganization: Joi.number().min(1).max(5).required().messages({
      "any.required": "Event organization rating is required.",
      "number.base": "Event organization must be a number.",
      "number.min": "Event organization must be at least 1.",
      "number.max": "Event organization must not exceed 5."
    }),
  
    venueQuality: Joi.number().min(1).max(5).required().messages({
      "any.required": "Venue quality rating is required.",
      "number.base": "Venue quality must be a number.",
      "number.min": "Venue quality must be at least 1.",
      "number.max": "Venue quality must not exceed 5."
    }),
  
    staffSupport: Joi.number().min(1).max(5).required().messages({
      "any.required": "Staff support rating is required.",
      "number.base": "Staff support must be a number.",
      "number.min": "Staff support must be at least 1.",
      "number.max": "Staff support must not exceed 5."
    }),
  
    eventContent: Joi.number().min(1).max(5).required().messages({
      "any.required": "Event content rating is required.",
      "number.base": "Event content must be a number.",
      "number.min": "Event content must be at least 1.",
      "number.max": "Event content must not exceed 5."
    }),
  
    mostHelpful: Joi.string().allow("").optional(),
    leastHelpful: Joi.string().allow("").optional(),
    suggestions: Joi.string().allow("").optional(),
  
    wouldRecommend: Joi.string()
      .valid("Definitely", "Probably", "Maybe", "Probably Not", "Definitely Not")
      .required()
      .messages({
        "any.required": "Recommendation choice is required.",
        "any.only": "Recommendation must be one of the provided options."
      }),
  
    futureParticipation: Joi.string()
      .valid("Yes, definitely", "Yes, probably", "Maybe", "Probably not", "No")
      .required()
      .messages({
        "any.required": "Future participation choice is required.",
        "any.only": "Future participation must be one of the provided options."
      }),
  
    additionalComments: Joi.string().allow("").optional(),
    shareTestimonial: Joi.boolean().optional().messages({ 
      "boolean.base": "Share testimonial must be true or false." 
    })
});
