import Joi from "joi";

export const signupSchema = Joi.object({
  studentId: Joi.string().length(8).required().messages({
    'string.base': 'Student ID must be a string',
    'string.length': 'Student ID must be exactly 8 characters',
    'any.required': 'Student ID is required'
  }),

  email: Joi.string().email().required().messages({
  'string.base': 'Email must be a string',
  'string.email': 'Email must be a valid email address',
  'any.required': 'Email is required'
  }),

  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm Password is required',
  }),

  firstname: Joi.string().trim().required().messages({
    'string.base': 'Firstname must be a string',
    'any.required': 'Firstname is required'
  }),

  lastname: Joi.string().trim().required().messages({
    'string.base': 'Lastname must be a string',
    'any.required': 'Lastname is required'
  }),

  middlename: Joi.string().length(1).trim().required().messages({
    'string.base': 'Middle initial must be a string',
    'string.length': 'Middle initial must be exactly 1 character',
    'any.required': 'Middle initial is required'
  }),

  age: Joi.number().integer().min(15).max(100).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 15',
    'number.max': 'Age must be at most 100',
    'any.required': 'Age is required'
  }),

  gender: Joi.string().valid('M', 'F').required().messages({
    'any.required': 'Gender is required'
  }),

  phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 11 digits',
    'any.required': 'Phone number is required'
  }),

  address: Joi.string().trim().required().messages({
    'string.base': 'Address must be a string',
    'any.required': 'Address is required'
  }),

  department: Joi.string().trim().required().messages({
    'string.base': 'Department must be a string',
    'any.required': 'Department is required'
  }),

  course: Joi.string().trim().required().messages({
    'string.base': 'Course must be a string',
    'any.required': 'Course is required'
  }),

  yearLevel: Joi.number().integer().min(1).required().messages({
    'any.required': 'Year is required'
  })
});

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
