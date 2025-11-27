import Joi from 'joi';

export const createPaymentLinkSchema = Joi.object({
    paymentMethods: Joi.array()
        .items(
            Joi.string()
                .valid(
                    'gcash',
                    'card', // instead of credit_card/debit_card/visa/mastercard/amex
                    'bpi',
                    'ubp',
                    'paymaya'
                )
                .messages({
                    'any.only': 'Invalid payment method provided.',
                })
        )
        .min(1)
        .required()
        .messages({
            'array.base': 'paymentMethods must be an array of strings.',
            'array.min': 'At least one payment method is required.',
        }),
    paymentId: Joi.alternatives().try(
        Joi.number().integer().positive(),
        Joi.string().pattern(/^\d+$/),
        Joi.valid(null)
    ).optional().allow(null).messages({
        'alternatives.match': 'paymentId must be a number, numeric string, or null.',
    }),
});

export const updatePaymentStatusSchema = Joi.object({
    status: Joi.string()
        .valid('ACTIVE', 'INACTIVE')
        .required()
        .messages({
            'any.only': 'Status must be either ACTIVE or INACTIVE.',
            'any.required': 'Status is required.'
        })
});

export const donationPaymentSchema = Joi.object({
    amount: Joi.number()
        .min(10)
        .required()
        .messages({
            'number.base': 'Amount must be a number.',
            'number.min': 'Minimum donation amount is ₱10.',
            'any.required': 'Amount is required.'
        }),
    description: Joi.string()
        .min(1)
        .max(500)
        .required()
        .messages({
            'string.base': 'Description must be a string.',
            'string.empty': 'Description cannot be empty.',
            'string.min': 'Description must be at least 1 character long.',
            'string.max': 'Description cannot exceed 500 characters.',
            'any.required': 'Description is required.'
        }),
    isAnonymous: Joi.boolean()
        .optional()
        .default(false)
        .messages({
            'boolean.base': 'isAnonymous must be a boolean value.'
        }),
    mailReceipt: Joi.boolean()
        .optional()
        .default(false)
        .messages({
            'boolean.base': 'mailReceipt must be a boolean value.'
        })
});

export const paymentSuccessSchema = Joi.object({
    checkout_session_id: Joi.string()
        .required()
        .messages({
            'string.base': 'checkout_session_id must be a string.',
            'string.empty': 'checkout_session_id cannot be empty.',
            'any.required': 'checkout_session_id is required.'
        })
});