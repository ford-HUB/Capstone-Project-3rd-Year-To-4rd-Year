import Joi from "joi"

export const staffInfoSchema = Joi.object({
  account_id: Joi.number().integer().required(),

  firstname: Joi.string().allow(null, ''),
  lastname: Joi.string().allow(null, ''),
  middle_initial: Joi.string().allow(null, ''),

  gender: Joi.string().valid('M', 'F').allow(null, ''), // assuming gender is 'M' or 'F'

  email_address: Joi.string().email().allow(null, ''),
  phone_number: Joi.string()
    .pattern(/^\d{10,11}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Phone number must be 10 to 11 digits'
    }),

  bio: Joi.string().allow(null, '')
})

export const staffAddressSchema = Joi.object({
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