import Joi from 'joi';

export const updateDonationStatusSchema = Joi.object({
    status: Joi.string()
        .valid('PENDING', 'RECEIVED', 'DISTRIBUTED', 'COMPLETED')
        .required()
        .messages({
            'any.only': 'Status must be one of: PENDING, RECEIVED, DISTRIBUTED, COMPLETED',
            'any.required': 'Status is required'
        })
});

export const bulkUpdateDonationStatusSchema = Joi.object({
    donationIds: Joi.array()
        .items(Joi.number().integer().positive())
        .min(1)
        .required()
        .messages({
            'array.base': 'donationIds must be an array of numbers',
            'array.min': 'At least one donation ID is required',
            'number.base': 'Each donation ID must be a positive integer'
        }),
    status: Joi.string()
        .valid('RECEIVED')
        .required()
        .messages({
            'any.only': 'Bulk update only supports RECEIVED status',
            'any.required': 'Status is required'
        })
});

export const exportDonationsSchema = Joi.object({
    donationIds: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .messages({
            'array.base': 'donationIds must be an array of numbers',
            'number.base': 'Each donation ID must be a positive integer'
        })
});
