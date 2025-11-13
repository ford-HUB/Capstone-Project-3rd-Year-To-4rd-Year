import Joi from "joi"

export const setUpAccountSchema = Joi.object({
    email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Enter a valid email address'
    }),

    password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),

    confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    }),

    department: Joi.alternatives()
    .conditional('role', {
      is: 'coordinator',
      then: Joi.string().required().messages({
        'string.empty': 'Department is required for coordinators'
      }),
      otherwise: Joi.string().allow(null, '').messages({
        'string.base': 'Department must be a string'
      })
    })
})


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


export const requestApprovalSchema = Joi.object({
  email: Joi.string().email().required(),

  fullname: Joi.string()
    .min(2)
    .max(100)
    .required(),

  requested_role: Joi.string()
    .valid('staff', 'coordinator', 'assistant_coordinator')
    .required(),

  reason: Joi.string()
    .allow(null, '')
});

export const profileInfoSchema = Joi.object({
  firstname: Joi.string().max(255).allow(null, ''),

  lastname: Joi.string().max(255).allow(null, ''),

  middle_initial: Joi.string().max(5).allow(null, ''),

  gender: Joi.string().valid('M', 'F').allow(null, ''),

  email_address: Joi.string().email().allow(null, ''),
  
  phone_number: Joi.string().pattern(/^\d{10,11}$/).allow(null, '')
    .messages({
      'string.pattern.base': 'Phone number must be 10 or 11 digits'
    }).optional(),

  bio: Joi.string().max(1000).allow(null, ''),

  department: Joi.string().max(255).allow(null, '')
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


export const updateEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  })
})

export const updatePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  })
})
