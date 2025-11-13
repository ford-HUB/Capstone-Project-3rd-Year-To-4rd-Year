import Joi from 'joi';

// Base form validation schema
export const createFormSchema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
        "any.required": "Form title is required.",
        "string.empty": "Form title cannot be empty.",
        "string.max": "Form title must not exceed 255 characters."
    }),

    description: Joi.string().allow("").optional(),

    category_id: Joi.number().integer().positive().optional().messages({
        "number.base": "Category ID must be a number.",
        "number.integer": "Category ID must be an integer.",
        "number.positive": "Category ID must be positive."
    }),

    event_id: Joi.number().integer().positive().optional().messages({
        "number.base": "Event ID must be a number.",
        "number.integer": "Event ID must be an integer.",
        "number.positive": "Event ID must be positive."
    }),

    form_schema: Joi.object({
        fields: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                type: Joi.string().valid('text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'rating').required(),
                label: Joi.string().required(),
                placeholder: Joi.string().optional(),
                required: Joi.boolean().default(false),
                options: Joi.array().items(Joi.string()).optional(),
                validation: Joi.object({
                    min: Joi.number().optional(),
                    max: Joi.number().optional(),
                    pattern: Joi.string().optional(),
                    message: Joi.string().optional()
                }).optional()
            })
        ).required()
    }).required().messages({
        "any.required": "Form schema is required.",
        "object.base": "Form schema must be an object."
    }),

    is_active: Joi.boolean().default(true),
    is_public: Joi.boolean().default(true)
});

// Update form validation schema
export const updateFormSchema = Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().allow("").optional(),
    category_id: Joi.number().integer().positive().allow(null).optional(),
    event_id: Joi.number().integer().positive().allow(null).optional(),
    form_schema: Joi.object({
        fields: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                type: Joi.string().valid('text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'rating').required(),
                label: Joi.string().required(),
                placeholder: Joi.string().optional(),
                required: Joi.boolean().default(false),
                options: Joi.array().items(Joi.string()).optional(),
                validation: Joi.object({
                    min: Joi.number().optional(),
                    max: Joi.number().optional(),
                    pattern: Joi.string().optional(),
                    message: Joi.string().optional()
                }).optional()
            })
        ).required()
    }).optional(),
    is_active: Joi.boolean().optional(),
    is_public: Joi.boolean().optional()
});

// Dynamic form response validation schema generator
export const generateFormResponseSchema = (formSchema) => {
    if (!formSchema || !formSchema.fields) {
        return Joi.object({});
    }

    const schemaFields = {};
    
    formSchema.fields.forEach(field => {
        let fieldSchema;
        
        switch (field.type) {
            case 'text':
            case 'email':
                fieldSchema = field.required 
                    ? Joi.string().required().messages({
                        "any.required": `${field.label} is required.`,
                        "string.empty": `${field.label} cannot be empty.`
                    })
                    : Joi.string().allow("").optional();
                break;
                
            case 'number':
                fieldSchema = field.required
                    ? Joi.number().required().messages({
                        "any.required": `${field.label} is required.`,
                        "number.base": `${field.label} must be a number.`
                    })
                    : Joi.number().optional();
                break;
                
            case 'textarea':
                fieldSchema = field.required
                    ? Joi.string().required().messages({
                        "any.required": `${field.label} is required.`,
                        "string.empty": `${field.label} cannot be empty.`
                    })
                    : Joi.string().allow("").optional();
                break;
                
            case 'select':
            case 'radio':
                if (field.options && field.options.length > 0) {
                    fieldSchema = field.required
                        ? Joi.string().valid(...field.options).required().messages({
                            "any.required": `${field.label} is required.`,
                            "any.only": `${field.label} must be one of the provided options.`
                        })
                        : Joi.string().valid(...field.options).optional();
                } else {
                    fieldSchema = Joi.string().optional();
                }
                break;
                
            case 'checkbox':
                fieldSchema = Joi.array().items(Joi.string()).optional();
                break;
                
            case 'file':
                fieldSchema = Joi.string().optional(); // File paths/URLs
                break;
                
            case 'rating':
                fieldSchema = field.required
                    ? Joi.number().min(1).max(5).required().messages({
                        "any.required": `${field.label} is required.`,
                        "number.min": `${field.label} must be at least 1.`,
                        "number.max": `${field.label} must not exceed 5.`
                    })
                    : Joi.number().min(1).max(5).optional();
                break;
                
            default:
                fieldSchema = Joi.string().optional();
        }
        
        // Apply custom validation if provided
        if (field.validation) {
            if (field.validation.min !== undefined) {
                fieldSchema = fieldSchema.min(field.validation.min);
            }
            if (field.validation.max !== undefined) {
                fieldSchema = fieldSchema.max(field.validation.max);
            }
            if (field.validation.pattern) {
                fieldSchema = fieldSchema.pattern(new RegExp(field.validation.pattern));
            }
        }
        
        schemaFields[field.id] = fieldSchema;
    });
    
    return Joi.object(schemaFields);
};

// Query parameters validation for getting forms
export const getFormsQuerySchema = Joi.object({
    category_id: Joi.number().integer().positive().optional(),
    event_id: Joi.number().integer().positive().optional(),
    is_active: Joi.boolean().optional(),
    is_public: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

// FormLink submission validation schema
export const submitFormLinkSchema = Joi.object({
    event_id: Joi.number().integer().positive().required().messages({
        "any.required": "Event ID is required.",
        "number.base": "Event ID must be a number.",
        "number.integer": "Event ID must be an integer.",
        "number.positive": "Event ID must be positive."
    }),

    target_role: Joi.string().valid('volunteer', 'beneficiary').required().messages({
        "any.required": "Target role is required.",
        "any.only": "Target role must be either 'volunteer' or 'beneficiary'."
    }),

    title: Joi.string().min(3).max(255).required().messages({
        "any.required": "Form title is required.",
        "string.empty": "Form title cannot be empty.",
        "string.min": "Form title must be at least 3 characters long.",
        "string.max": "Form title must not exceed 255 characters."
    }),

    description: Joi.string().min(10).max(1000).required().messages({
        "any.required": "Form description is required.",
        "string.empty": "Form description cannot be empty.",
        "string.min": "Form description must be at least 10 characters long.",
        "string.max": "Form description must not exceed 1000 characters."
    }),

    form_link: Joi.string().uri().pattern(/^https:\/\/docs\.google\.com\/forms\/d\/.+/).required().messages({
        "any.required": "Google Form link is required.",
        "string.empty": "Google Form link cannot be empty.",
        "string.uri": "Please provide a valid URL.",
        "string.pattern.base": "Please provide a valid Google Form URL (https://docs.google.com/forms/d/...)."
    }),

    sheet_link: Joi.string().uri().pattern(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/).allow('').optional().messages({
        "string.uri": "Please provide a valid URL.",
        "string.pattern.base": "Please provide a valid Google Sheets URL (https://docs.google.com/spreadsheets/d/...)."
    })
});

// Update Google Form Link validation schema
export const updateFormLinkSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional().messages({
        "string.min": "Form title must be at least 3 characters long.",
        "string.max": "Form title must not exceed 255 characters."
    }),

    description: Joi.string().min(10).max(1000).optional().messages({
        "string.min": "Form description must be at least 10 characters long.",
        "string.max": "Form description must not exceed 1000 characters."
    }),

    target_role: Joi.string().valid('volunteer', 'beneficiary').optional().messages({
        "any.only": "Target role must be either 'volunteer' or 'beneficiary'."
    }),

    form_link: Joi.string().uri().pattern(/^https:\/\/docs\.google\.com\/forms\/d\/.+/).optional().messages({
        "string.uri": "Please provide a valid URL.",
        "string.pattern.base": "Please provide a valid Google Form URL (https://docs.google.com/forms/d/...)."
    }),

    sheet_link: Joi.string().uri().pattern(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/.+/).allow('').optional().messages({
        "string.uri": "Please provide a valid URL.",
        "string.pattern.base": "Please provide a valid Google Sheets URL (https://docs.google.com/spreadsheets/d/...)."
    })
});

// Query parameters validation for getting Google Form links
export const getGoogleFormLinksQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    target_role: Joi.string().valid('volunteer', 'beneficiary', '').optional(),
    event_id: Joi.number().integer().positive().optional()
});