import Joi from 'joi';

export const signupSchema = Joi.object({
    studentId: Joi.string()
      .empty('undefined')
      .empty('')
      .when('isBeneficiary', {
        is: 'false',
        then: Joi.string().length(8).required().messages({
          'string.base': 'Student ID must be a string',
          'string.length': 'Student ID must be exactly 8 characters',
          'any.required': 'Student ID is required for regular volunteers',
        }),
        otherwise: Joi.optional().allow('').messages({
          'string.length': 'Student ID must be exactly 8 characters if provided',
        }),
      }),
  
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  
    password: Joi.string().min(6).required().messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
  
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm Password is required',
      }),
  
    firstname: Joi.string().trim().required().messages({
      'string.base': 'Firstname must be a string',
      'any.required': 'Firstname is required',
    }),
  
    lastname: Joi.string().trim().required().messages({
      'string.base': 'Lastname must be a string',
      'any.required': 'Lastname is required',
    }),
  
    middlename: Joi.string().length(1).trim().required().messages({
      'string.base': 'Middle initial must be a string',
      'string.length': 'Middle initial must be exactly 1 character',
      'any.required': 'Middle initial is required',
    }),
  
    // Age as string, but validated as number
    age: Joi.string()
      .trim()
      .required()
      .custom((value, helpers) => {
        const num = Number(value);
        if (Number.isNaN(num)) return helpers.error('number.base');
        if (num < 15 || num > 100) return helpers.error('number.range');
        return value; // keep as string
      })
      .messages({
        'any.required': 'Age is required',
        'number.base': 'Age must be a number',
        'number.range': 'Age must be between 15 and 100',
      }),
  
    gender: Joi.string().valid('M', 'F').required().messages({
      'any.required': 'Gender is required',
      'any.only': 'Gender must be M or F',
    }),
  
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be exactly 11 digits',
        'any.required': 'Phone number is required',
      }),
  
    address: Joi.string().trim().required().messages({
      'string.base': 'Address must be a string',
      'any.required': 'Address is required',
    }),
  
    department: Joi.string()
      .trim()
      .empty('undefined')
      .empty('')
      .when('isBeneficiary', {
        is: 'false',
        then: Joi.required().messages({
          'any.required': 'Department is required for regular volunteers',
        }),
        otherwise: Joi.optional().allow(''),
      }),
  
    course: Joi.string()
      .trim()
      .empty('undefined')
      .empty('')
      .when('isBeneficiary', {
        is: 'false',
        then: Joi.required().messages({
          'any.required': 'Course is required for regular volunteers',
        }),
        otherwise: Joi.optional().allow(''),
      }),
  
    yearLevel: Joi.string()
      .trim()
      .empty('undefined')
      .empty('')
      .custom((value, helpers) => {
        if (!value || value === '') return helpers.error('any.required');
        const num = Number(value);
        if (Number.isNaN(num)) return helpers.error('number.base');
        if (num < 1 || num > 12) return helpers.error('number.range');
        return value; // keep as string
      })
      .when('isBeneficiary', {
        is: 'true',
        then: Joi.optional().allow(''),
        otherwise: Joi.required(),
      })
      .messages({
        'any.required': 'Year level is required for regular volunteers',
        'number.base': 'Year level must be a number',
        'number.range': 'Year level must be between 1 and 10',
      }),
  
    isBeneficiary: Joi.string()
      .valid('true', 'false')
      .required()
      .messages({
        'any.required': 'Beneficiary status is required',
        'any.only': 'Beneficiary must be true or false',
      }),
  
    beneficiaryType: Joi.string()
      .valid('individual', 'organization')
      .empty('undefined')
      .when('isBeneficiary', {
        is: 'true',
        then: Joi.required().messages({
          'any.required': 'Beneficiary type is required for beneficiaries',
        }),
        otherwise: Joi.optional().allow(''),
      }),
  
    organization_name: Joi.string()
      .trim()
      .empty('undefined')
      .when('beneficiaryType', {
        is: 'organization',
        then: Joi.required().messages({
          'any.required': 'Organization name is required for organization beneficiaries',
        }),
        otherwise: Joi.optional().allow(''),
      }),
  });

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),

    password: Joi.string().required().messages({
        'any.required': 'password is required',
    }),
});

export const updateProfileSchema = Joi.object({
    firstname: Joi.string().trim().required().messages({
        'string.base': 'Firstname must be a string',
        'any.required': 'Firstname is required',
    }),
    lastname: Joi.string().trim().required().messages({
        'string.base': 'Lastname must be a string',
        'any.required': 'Lastname is required',
    }),
    gender: Joi.string()
        .valid('M', 'F', 'prefer not to say')
        .required()
        .messages({
            'any.only': 'Gender must be male, female, or other',
            'any.required': 'Gender is required',
        }),
    middle_initial: Joi.string().length(1).trim().required().messages({
        'string.length': 'Middle initial must be a single character',
        'any.required': 'Middle initial is required',
    }),
    phone_number: Joi.string()
        .pattern(/^[0-9]{11}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be exactly 11 digits',
            'any.required': 'Phone number is required',
        }),
    current_address: Joi.string().trim().required().messages({
        'string.base': 'Current address must be a string',
        'any.required': 'Current address is required',
    }),
    course: Joi.string().trim().required().messages({
        'string.base': 'Course must be a string',
        'any.required': 'Course is required',
    }),
    department: Joi.string().trim().required().messages({
        'string.base': 'Department must be a string',
        'any.required': 'Department is required',
    }),
    year_level: Joi.number().integer().min(1).max(12).required().messages({
        'number.base': 'Year level must be a number',
        'number.min': 'Year level must be at least 1',
        'number.max': 'Year level cannot be greater than 6',
        'any.required': 'Year level is required',
    }),
    disability: Joi.string().allow('').optional().messages({
        'string.base': 'Disability must be a string',
    }),
    disability_specification: Joi.string().allow('').optional().messages({
        'string.base': 'Disability specification must be a string',
    }),
    is_subscribed: Joi.boolean().required().messages({
        'boolean.base': 'Subscribed status must be true or false',
        'any.required': 'Subscribed status is required',
    }),
    is_beneficiary: Joi.boolean().optional().messages({
        'boolean.base': 'Beneficiary status must be true or false',
    }),
});

export const emailUpdateSchema = Joi.object({
    newEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'New email is required',
            'string.email': 'Please provide a valid email address',
        }),

    confirmEmail: Joi.string().valid(Joi.ref('newEmail')).required().messages({
        'any.only': 'Confirm email must match new email',
        'string.empty': 'Please confirm your email',
    }),
});

// Participant (student) password change schema
export const participantPasswordChangeSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required',
    }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'any.required': 'New password is required',
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password must match new password',
      'string.empty': 'Please confirm your new password',
      'any.required': 'Please confirm your new password',
    }),
});

export const eventRegistrationSchema = Joi.object({
    emergency_contact_fullname: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.base': 'Emergency contact full name must be a string',
        }),

    emergency_contact_number: Joi.string()
        .allow('')
        .optional()
        .pattern(/^\d{11}$/)
        .messages({
            'string.pattern.base': 'Emergency contact number must be exactly 11 digits',
        }),

    relationship: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.base': 'Relationship must be a string',
        }),

    emergency_contact_email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(null, '')
        .optional()
        .messages({
            'string.email': 'Invalid email format',
        }),
});
