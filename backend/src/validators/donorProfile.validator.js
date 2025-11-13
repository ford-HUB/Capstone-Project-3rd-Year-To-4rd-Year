import Joi from "joi"

export const updateProfileSchema = Joi.object({
    fullname: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-Z\s]+$/)
        .optional()
        .messages({
            'string.min': 'Full name must be at least 2 characters',
            'string.max': 'Full name must not exceed 100 characters',
            'string.pattern.base': 'Full name can only contain letters and spaces'
        })
})

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Current password is required',
            'any.required': 'Current password is required'
        }),
    
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            'any.required': 'New password is required'
        }),
    
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Password confirmation does not match',
            'string.empty': 'Please confirm your new password',
            'any.required': 'Please confirm your new password'
        })
}).custom((value, helpers) => {
    // Check if new password is different from current password
    if (value.currentPassword === value.newPassword) {
        return helpers.error('custom.passwordSame');
    }
    return value;
}).messages({
    'custom.passwordSame': 'New password must be different from current password'
})
