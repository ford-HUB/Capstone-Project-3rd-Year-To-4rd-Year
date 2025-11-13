import Joi from "joi"

export const eventSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty'
  }),

  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty'
  }),

  event_started: Joi.date().required().messages({
    'any.required': 'Start date and time is required',
    'date.base': 'event_started must be a valid date'
  }),

  event_ended: Joi.date().greater(Joi.ref('event_started')).required().messages({
    'any.required': 'End date and time is required',
    'date.base': 'event_ended must be a valid date',
    'date.greater': 'event_ended must be after event_started'
  }),

  location: Joi.string().required().messages({
    'any.required': 'Location is required',
    'string.empty': 'Location cannot be empty'
  }),

  max_participants: Joi.number().integer().min(1).required().messages({
    'any.required': 'Max participants is required',
    'number.base': 'Max participants must be a number',
    'number.min': 'There must be at least 1 participant allowed'
  }),

  organizer_name: Joi.string().required().messages({
    'any.required': 'Organizer is required',
  }),

  category: Joi.string().valid(
    'School', 'Community',
    'Emergency', 'Donation Drive',
    'Charity', 'Relief Program',
    'Health', 'Outreach', 'Training', 'Seminar', 'Others'
  ).required().messages({
    'any.required': 'Category is required',
    'string.empty': 'Category cannot be empty',
    'any.only': 'Category must be one of the predefined options'
  }),

  specified_category: Joi.when('category', {
    is: 'Others',
    then: Joi.string().required().min(1).messages({
        'any.required': 'Specified category is required when category is Others',
        'string.empty': 'Specified category cannot be empty',
        'string.min': 'Specified category must not be empty'
    }),
    otherwise: Joi.string().allow("").optional()
  }),

  department: Joi.when('category', {
    is: 'School',
    then: Joi.string().required().messages({
        'any.required': 'Department is required for school events'
    }),
    otherwise: Joi.string().allow("").optional() // prevent insertion if it is not school
  }),

  // Beneficiary applicability fields
  beneficiary_applicable: Joi.boolean().default(false).messages({
    'boolean.base': 'Beneficiary applicable must be true or false'
  }),

  max_beneficiaries: Joi.when('beneficiary_applicable', {
    is: true,
    then: Joi.number().integer().min(1).required().messages({
      'any.required': 'Max beneficiaries is required when beneficiary applicable is true',
      'number.base': 'Max beneficiaries must be a number',
      'number.min': 'There must be at least 1 beneficiary allowed'
    }),
    otherwise: Joi.number().integer().min(1).optional().messages({
      'number.base': 'Max beneficiaries must be a number',
      'number.min': 'There must be at least 1 beneficiary allowed'
    })
  })
})

export const add_interestSchema = Joi.object({
  interest: Joi.array()
    .items(Joi.string().trim().min(1)).required().messages({
      'array.base': 'Interest must be an array',
      'array.includes': 'Each interest must be a string',
      'any.required': 'Interest is required',
    }),
});

export const register_eventSchema =  Joi.object({
  notes: Joi.string().optional()
})
