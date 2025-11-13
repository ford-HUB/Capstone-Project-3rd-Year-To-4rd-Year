import Joi from 'joi';

export const uploadDocumentSchema = Joi.object({
    title: Joi.string().trim().min(1).required().messages({
        'string.base': 'Title must be a text',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),

    category: Joi.string().trim().min(1).required().messages({
        'string.base': 'Category must be a text',
        'string.empty': 'Category is required',
        'any.required': 'Category is required',
    }),

    tags: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Tags must be a text',
    })
});
