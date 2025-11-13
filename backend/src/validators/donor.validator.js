import Joi from "joi"

export const donorSignupSchema = Joi.object({
    fullname: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'any.required': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters',
            'string.max': 'Full name must not exceed 100 characters',
            'string.pattern.base': 'Full name can only contain letters and spaces'
        }),

    email: Joi.string().email().required().messages({
        'any.required': 'email is required'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
    }),
    
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm Password is required',
    }),
})

export const donorLoginSchema = Joi.object({
    email: Joi.string().email().messages({
        'any.required': 'email is required'
    }),

    password: Joi.string().required().messages({
        'any.required': 'password is required'
    })
})