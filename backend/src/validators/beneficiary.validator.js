import Joi from 'joi';

// Beneficiary event registration validation schema
export const beneficiaryEventRegistrationSchema = Joi.object({
    // Needs Assessment Information
    current_situation: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Please provide more details about your current situation (at least 10 characters)',
            'string.max': 'Current situation description must be less than 1000 characters',
            'any.required': 'Please tell us about your current situation'
        }),
    
    needs: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Please provide more details about your needs (at least 10 characters)',
            'string.max': 'Needs description must be less than 1000 characters',
            'any.required': 'Please tell us what your needs are'
        }),
    
    how_can_we_help: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Please provide more details about how we can assist you (at least 10 characters)',
            'string.max': 'How we can help description must be less than 1000 characters',
            'any.required': 'Please tell us how we can help you'
        })
    
    // ID Verification Information (handled by file upload middleware)
    // id_files validation is handled by multer middleware
});


export const beneficiaryProfileUpdateSchema = Joi.object({
    firstname: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name must be less than 50 characters',
            'any.required': 'First name is required'
        }),
    
    lastname: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name must be less than 50 characters',
            'any.required': 'Last name is required'
        }),
    
    middle_initial: Joi.string()
        .max(1)
        .allow('')
        .optional()
        .messages({
            'string.max': 'Middle initial must be exactly 1 character'
        }),
    
    phone_number: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .min(10)
        .max(11)
        .required()
        .messages({
            'string.pattern.base': 'Please enter a valid phone number',
            'string.min': 'Phone number must be at least 10 digits',
            'string.max': 'Phone number must be at most 11 digits',
            'any.required': 'Phone number is required'
        }),
    
    current_address: Joi.string()
        .min(10)
        .max(200)
        .required()
        .messages({
            'string.min': 'Address must be at least 10 characters',
            'string.max': 'Address must be less than 200 characters',
            'any.required': 'Current address is required'
        }),
    
    age: Joi.number()
        .integer()
        .min(1)
        .max(120)
        .required()
        .messages({
            'number.min': 'Age must be at least 1',
            'number.max': 'Age must be reasonable',
            'number.integer': 'Age must be a whole number',
            'any.required': 'Age is required'
        }),
    
    gender: Joi.string()
        .valid('M', 'F', 'O')
        .required()
        .messages({
            'any.only': 'Please select your gender',
            'any.required': 'Please select your gender'
        }),
    
    organization_name: Joi.string()
        .max(100)
        .allow('')
        .optional()
        .messages({
            'string.max': 'Organization name must be less than 100 characters'
        })
});

// Beneficiary email update validation schema
export const beneficiaryEmailUpdateSchema = Joi.object({
    newEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'New email is required',
            'string.email': 'Please provide a valid email address',
        }),
    
    confirmEmail: Joi.string()
        .valid(Joi.ref('newEmail'))
        .required()
        .messages({
            'any.only': 'Confirm email must match new email',
            'string.empty': 'Please confirm your email',
        })
});

// Beneficiary password change validation schema
export const beneficiaryPasswordChangeSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Current password is required',
        }),
    
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        }),
    
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Password confirmation does not match',
            'string.empty': 'Please confirm your new password',
        })
}).custom((value, helpers) => {
    // Check if new password is different from current password
    if (value.currentPassword === value.newPassword) {
        return helpers.error('custom.passwordSame');
    }
    
    return value;
}).messages({
    'custom.passwordSame': 'New password must be different from current password'
});

export default {
    beneficiaryEventRegistrationSchema,
    beneficiaryProfileUpdateSchema,
    beneficiaryEmailUpdateSchema,
    beneficiaryPasswordChangeSchema
};
