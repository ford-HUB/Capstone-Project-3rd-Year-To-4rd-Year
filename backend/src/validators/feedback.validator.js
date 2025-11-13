import Joi from 'joi';

export const eventEvaluationSchema = Joi.object({
    overallRating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Overall rating is required.",
      "number.base": "Overall rating must be a number.",
      "number.min": "Overall rating must be at least 1.",
      "number.max": "Overall rating must not exceed 5."
    }),
  
    contentQuality: Joi.number().min(1).max(5).required().messages({
      "any.required": "Content quality rating is required.",
      "number.base": "Content quality must be a number.",
      "number.min": "Content quality must be at least 1.",
      "number.max": "Content quality must not exceed 5."
    }),
  
    organizationRating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Organization rating is required.",
      "number.base": "Organization rating must be a number."
    }),
  
    venueRating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Venue rating is required.",
      "number.base": "Venue rating must be a number."
    }),
  
    mostValuable: Joi.string().allow(""),
    leastValuable: Joi.string().allow(""),
    suggestions: Joi.string().allow(""),
  
    guidanceDuringEvent: Joi.number().min(1).max(5).required().messages({
      "any.required": "Guidance & support rating is required.",
      "number.base": "Guidance & support rating must be a number."
    }),
  
    communicationRating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Communication rating is required.",
      "number.base": "Communication rating must be a number."
    }),
  
    recommendEvent: Joi.string()
      .valid("Definitely", "Probably", "Maybe", "Probably Not", "Definitely Not")
      .required()
      .messages({
        "any.required": "Recommendation choice is required.",
        "any.only": "Recommendation must be one of the provided options."
      }),
  
    futureTopics: Joi.string().allow(""),
  
    futureParticipation: Joi.string()
      .valid("Yes, definitely", "Yes, probably", "Maybe", "Probably not", "No")
      .required()
      .messages({
        "any.required": "Future participation choice is required.",
        "any.only": "Future participation must be one of the provided options."
      }),
  
    additionalComments: Joi.string().allow(""),
    shareTestimonial: Joi.boolean().optional().messages({ "boolean.base": "Share testimonial must be true or false." })
  });