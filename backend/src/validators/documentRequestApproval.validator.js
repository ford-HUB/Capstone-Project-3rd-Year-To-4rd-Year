import Joi from 'joi';

// Schema for creating document request approval
export const createDocumentRequestApprovalSchema = Joi.object({
    document_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Document ID must be a number',
            'number.integer': 'Document ID must be an integer',
            'number.positive': 'Document ID must be a positive integer',
            'any.required': 'Document ID is required'
        }),
    request_type: Joi.string().valid('approval', 'revision', 'publication').required()
        .messages({
            'any.only': 'Request type must be one of: approval, revision, publication',
            'any.required': 'Request type is required'
        }),
    request_reason: Joi.string().min(1).max(1000).required()
        .messages({
            'string.min': 'Request reason is required',
            'string.max': 'Request reason must not exceed 1000 characters',
            'any.required': 'Request reason is required'
        }),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional()
        .messages({
            'any.only': 'Priority must be one of: low, medium, high, urgent'
        }),
    due_date: Joi.date().iso().optional()
        .messages({
            'date.format': 'Due date must be a valid ISO date format'
        })
});

// Schema for updating document request approval status
export const updateDocumentRequestApprovalStatusSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected', 'needs_revision').required()
        .messages({
            'any.only': 'Status must be one of: approved, rejected, needs_revision',
            'any.required': 'Status is required'
        }),
    review_notes: Joi.string().max(1000).optional()
        .messages({
            'string.max': 'Review notes must not exceed 1000 characters'
        }),
    rejection_reason: Joi.string().max(1000).optional()
        .messages({
            'string.max': 'Rejection reason must not exceed 1000 characters'
        })
});

// Schema for filtering document request approvals
export const documentRequestApprovalFilterSchema = Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected', 'needs_revision').optional()
        .messages({
            'any.only': 'Status must be one of: pending, approved, rejected, needs_revision'
        }),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional()
        .messages({
            'any.only': 'Priority must be one of: low, medium, high, urgent'
        }),
    request_type: Joi.string().valid('approval', 'revision', 'publication').optional()
        .messages({
            'any.only': 'Request type must be one of: approval, revision, publication'
        })
});

// Schema for document request approval ID parameter
export const documentRequestApprovalIdSchema = Joi.object({
    dra_id: Joi.string().pattern(/^\d+$/).required()
        .messages({
            'string.pattern.base': 'Document request approval ID must be a number',
            'any.required': 'Document request approval ID is required'
        })
});
