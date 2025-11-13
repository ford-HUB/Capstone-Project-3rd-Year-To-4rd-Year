import Joi from 'joi';

export const createSubmissionSchema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title should have a minimum length of {#limit}',
        'string.max': 'Title should have a maximum length of {#limit}',
        'any.required': 'Title is required'
    }),
    description: Joi.string().max(1000).allow('', null).messages({
        'string.max': 'Description should have a maximum length of {#limit}'
    }),
    submission_type: Joi.string().valid('Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance').required().messages({
        'any.only': 'Submission type must be one of "Annual", "Monthly", "Quarterly", "Special", "Compliance"',
        'any.required': 'Submission type is required'
    }),
    department_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Department ID must be a number',
        'number.integer': 'Department ID must be an integer',
        'number.positive': 'Department ID must be a positive number',
        'any.required': 'Department ID is required'
    })
});

export const submissionIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'Submission ID must be a number',
        'number.integer': 'Submission ID must be an integer',
        'number.positive': 'Submission ID must be a positive number',
        'any.required': 'Submission ID is required'
    })
});

export const updateSubmissionSchema = Joi.object({
    title: Joi.string().min(1).max(255).messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title should have a minimum length of {#limit}',
        'string.max': 'Title should have a maximum length of {#limit}'
    }),
    description: Joi.string().max(1000).allow('', null).messages({
        'string.max': 'Description should have a maximum length of {#limit}'
    }),
    submission_type: Joi.string().valid('Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance').messages({
        'any.only': 'Submission type must be one of "Annual", "Monthly", "Quarterly", "Special", "Compliance"'
    }),
    status: Joi.string().valid('submitted', 'under_review', 'approved', 'rejected').messages({
        'any.only': 'Status must be one of "submitted", "under_review", "approved", "rejected"'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export const submissionFilterSchema = Joi.object({
    department_id: Joi.number().integer().positive().messages({
        'number.base': 'Department ID must be a number',
        'number.integer': 'Department ID must be an integer',
        'number.positive': 'Department ID must be a positive number'
    }),
    submission_type: Joi.string().valid('Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance').messages({
        'any.only': 'Submission type must be one of "Annual", "Monthly", "Quarterly", "Special", "Compliance"'
    }),
    status: Joi.string().valid('submitted', 'under_review', 'approved', 'rejected').messages({
        'any.only': 'Status must be one of "submitted", "under_review", "approved", "rejected"'
    }),
    submitted_by: Joi.number().integer().positive().messages({
        'number.base': 'Submitted by ID must be a number',
        'number.integer': 'Submitted by ID must be an integer',
        'number.positive': 'Submitted by ID must be a positive number'
    })
});
