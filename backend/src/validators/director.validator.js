import Joi from "joi"

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
    }),

    password: Joi.string().required().messages({
        'any.required': 'password is required'
    })
})

export const InfoSchema = Joi.object({
  facebook: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'Facebook must be a valid URL'
  }),

  insta: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'Instagram must be a valid URL'
  }),

  linkedin: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'LinkedIn must be a valid URL'
  }),

  X: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'X (Twitter) must be a valid URL'
  }),
  
  firstname: Joi.string().required().messages({
    'any.required': 'Firstname is required',
    'string.base': 'Firstname must be a string'
  }),

  lastname: Joi.string().required().messages({
    'any.required': 'Lastname is required',
    'string.base': 'Lastname must be a string'
  }),

  email_address: Joi.string().email().required().messages({
    'string.base': 'Email address must be a string',
    'string.email': 'Email address must be a valid email',
    'any.required': 'Email address is required'
  }),

  phone_number: Joi.string()
    .pattern(/^\d{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 or 11 digits',
      'any.required': 'Phone number is required'
    }),

  role_bio: Joi.string().required().messages({
    'any.required': 'Role is required',
    'string.base': 'Role must be a string'
  }),

  school: Joi.string().required().messages({
    'any.required': 'School is required',
    'string.base': 'School must be a string'
  })
})

export const addressSchema = Joi.object({
  province: Joi.string().allow(null, '').messages({
    'string.base': 'Province must be a string'
  }),

  city: Joi.string().allow(null, '').messages({
    'string.base': 'City must be a string'
  }),

  postal_code: Joi.number().integer().allow(null).messages({
    'number.base': 'Postal code must be a number',
    'number.integer': 'Postal code must be an integer'
  }),

  brgy: Joi.string().allow(null, '').messages({
    'string.base': 'Barangay must be a string'
  })
})

export const directorEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  })
})

export const directorPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  })
})
