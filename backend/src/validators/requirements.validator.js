import Joi from 'joi';
import dayjs from 'dayjs';

export const createRequirementSchema = Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title should have a minimum length of {#limit}',
        'string.max': 'Title should have a maximum length of {#limit}',
        'any.required': 'Title is required'
    }),
    description: Joi.string().max(500).allow('', null).messages({
        'string.max': 'Description should have a maximum length of {#limit}'
    }),
    dueDate: Joi.date().iso().min(dayjs().format('YYYY-MM-DD')).required().messages({
        'date.base': 'Due date must be a valid date',
        'date.format': 'Due date must be in YYYY-MM-DD format',
        'date.min': 'Due date must be today or a future date',
        'any.required': 'Due date is required'
    }),
    category: Joi.string().valid('Annual Report', 'Monthly Report', 'Financial Statement', 'Compliance Document', 'Special').required().messages({
        'any.only': 'Category must be one of "Annual Report", "Monthly Report", "Financial Statement", "Compliance Document", "Special"',
        'any.required': 'Category is required'
    }),
    isRequired: Joi.boolean().default(true).messages({
        'boolean.base': 'Is Required must be a boolean value'
    })
});

export const requirementIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'Requirement ID must be a number',
        'number.integer': 'Requirement ID must be an integer',
        'number.positive': 'Requirement ID must be a positive number',
        'any.required': 'Requirement ID is required'
    })
});

export const updateRequirementSchema = Joi.object({
    title: Joi.string().min(1).max(100).messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title should have a minimum length of {#limit}',
        'string.max': 'Title should have a maximum length of {#limit}'
    }),
    description: Joi.string().max(500).allow('', null).messages({
        'string.max': 'Description should have a maximum length of {#limit}'
    }),
    dueDate: Joi.date().iso().min(dayjs().format('YYYY-MM-DD')).messages({
        'date.base': 'Due date must be a valid date',
        'date.format': 'Due date must be in YYYY-MM-DD format',
        'date.min': 'Due date must be today or a future date'
    }),
    category: Joi.string().valid('Annual Report', 'Monthly Report', 'Financial Statement', 'Compliance Document', 'Special').messages({
        'any.only': 'Category must be one of "Annual Report", "Monthly Report", "Financial Statement", "Compliance Document", "Special"'
    }),
    isRequired: Joi.boolean().messages({
        'boolean.base': 'Is Required must be a boolean value'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export const roleSchema = Joi.object({
    role: Joi.string().valid('staff', 'coordinator', 'management', 'director').required().messages({
        'any.only': 'Role must be one of "staff", "coordinator", "management", "director"',
        'any.required': 'Role is required'
    })
});