import Joi from "joi"

export const donorSignupSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
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