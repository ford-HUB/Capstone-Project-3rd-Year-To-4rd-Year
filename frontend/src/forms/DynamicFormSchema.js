import { z } from 'zod';

// Dynamic form field types
export const FIELD_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    NUMBER: 'number',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    FILE: 'file',
    RATING: 'rating'
};

// Generate dynamic form schema based on form fields
export const generateDynamicFormSchema = (formFields) => {
    if (!formFields || !Array.isArray(formFields)) {
        return z.object({});
    }

    const schemaFields = {};
    
    formFields.forEach(field => {
        let fieldSchema;
        
        switch (field.type) {
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.EMAIL:
                fieldSchema = field.required 
                    ? z.string().min(1, { message: `${field.label} is required.` })
                    : z.string().optional();
                break;
                
            case FIELD_TYPES.NUMBER:
                fieldSchema = field.required
                    ? z.number({ required_error: `${field.label} is required.` })
                    : z.number().optional();
                break;
                
            case FIELD_TYPES.TEXTAREA:
                fieldSchema = field.required
                    ? z.string().min(1, { message: `${field.label} is required.` })
                    : z.string().optional();
                break;
                
            case FIELD_TYPES.SELECT:
            case FIELD_TYPES.RADIO:
                if (field.options && field.options.length > 0) {
                    fieldSchema = field.required
                        ? z.enum(field.options, { 
                            required_error: `${field.label} is required.`,
                            invalid_type_error: `${field.label} must be one of the provided options.`
                        })
                        : z.enum(field.options).optional();
                } else {
                    fieldSchema = z.string().optional();
                }
                break;
                
            case FIELD_TYPES.CHECKBOX:
                fieldSchema = z.array(z.string()).optional();
                break;
                
            case FIELD_TYPES.FILE:
                fieldSchema = z.string().optional(); // File paths/URLs
                break;
                
            case FIELD_TYPES.RATING:
                fieldSchema = field.required
                    ? z.number()
                        .min(1, { message: `${field.label} must be at least 1.` })
                        .max(5, { message: `${field.label} must not exceed 5.` })
                        .refine(val => val >= 1 && val <= 5, {
                            message: `${field.label} must be between 1 and 5.`
                        })
                    : z.number()
                        .min(1)
                        .max(5)
                        .optional();
                break;
                
            default:
                fieldSchema = z.string().optional();
        }
        
        // Apply custom validation if provided
        if (field.validation) {
            if (field.validation.min !== undefined) {
                if (fieldSchema._def.typeName === 'ZodString') {
                    fieldSchema = fieldSchema.min(field.validation.min, {
                        message: field.validation.message || `${field.label} must be at least ${field.validation.min} characters.`
                    });
                } else if (fieldSchema._def.typeName === 'ZodNumber') {
                    fieldSchema = fieldSchema.min(field.validation.min, {
                        message: field.validation.message || `${field.label} must be at least ${field.validation.min}.`
                    });
                }
            }
            if (field.validation.max !== undefined) {
                if (fieldSchema._def.typeName === 'ZodString') {
                    fieldSchema = fieldSchema.max(field.validation.max, {
                        message: field.validation.message || `${field.label} must not exceed ${field.validation.max} characters.`
                    });
                } else if (fieldSchema._def.typeName === 'ZodNumber') {
                    fieldSchema = fieldSchema.max(field.validation.max, {
                        message: field.validation.message || `${field.label} must not exceed ${field.validation.max}.`
                    });
                }
            }
            if (field.validation.pattern) {
                fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern), {
                    message: field.validation.message || `${field.label} format is invalid.`
                });
            }
        }
        
        schemaFields[field.id] = fieldSchema;
    });
    
    return z.object(schemaFields);
};

// Default values generator for dynamic forms
export const generateDefaultValues = (formFields) => {
    if (!formFields || !Array.isArray(formFields)) {
        return {};
    }

    const defaultValues = {};
    
    formFields.forEach(field => {
        switch (field.type) {
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.EMAIL:
            case FIELD_TYPES.TEXTAREA:
                defaultValues[field.id] = '';
                break;
                
            case FIELD_TYPES.NUMBER:
                defaultValues[field.id] = 0;
                break;
                
            case FIELD_TYPES.SELECT:
            case FIELD_TYPES.RADIO:
                defaultValues[field.id] = field.options && field.options.length > 0 ? field.options[0] : '';
                break;
                
            case FIELD_TYPES.CHECKBOX:
                defaultValues[field.id] = [];
                break;
                
            case FIELD_TYPES.FILE:
                defaultValues[field.id] = '';
                break;
                
            case FIELD_TYPES.RATING:
                defaultValues[field.id] = 0;
                break;
                
            default:
                defaultValues[field.id] = '';
        }
    });
    
    return defaultValues;
};

// Form field validation rules
export const getFieldValidationRules = (field) => {
    const rules = {};
    
    if (field.required) {
        rules.required = `${field.label} is required.`;
    }
    
    if (field.validation) {
        if (field.validation.min !== undefined) {
            rules.min = field.validation.min;
        }
        if (field.validation.max !== undefined) {
            rules.max = field.validation.max;
        }
        if (field.validation.pattern) {
            rules.pattern = {
                value: new RegExp(field.validation.pattern),
                message: field.validation.message || `${field.label} format is invalid.`
            };
        }
    }
    
    return rules;
};
