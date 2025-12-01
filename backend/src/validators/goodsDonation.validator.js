import Joi from 'joi';

export const goodsDonationSchema = Joi.object({
    // Goods information
    goodsType: Joi.string()
        .valid(
            'ready_to_eat_food',
            'hygiene_kits',
            'baby_needs',
            'bottled_water',
            'blankets_towels',
            'emergency_kits',
            'medicine'
        )
        .required()
        .messages({
            'string.base': 'Goods type must be a string',
            'any.required': 'Goods type is required',
            'any.only': 'Invalid goods type selected'
        }),
    
    goodsDescription: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 1000 characters',
            'any.required': 'Description is required'
        }),
    
    quantity: Joi.alternatives()
        .try(
            Joi.string().pattern(/^\d+$/).messages({
                'string.pattern.base': 'Quantity must be a valid number'
            }),
            Joi.number().positive().messages({
                'number.base': 'Quantity must be a valid number',
                'number.positive': 'Quantity must be a positive number'
            })
        )
        .required()
        .messages({
            'any.required': 'Quantity is required',
            'alternatives.match': 'Quantity must be a valid positive number'
        }),
    
    quantityUnit: Joi.string()
        .valid('Items', 'Boxes', 'Pieces')
        .required()
        .messages({
            'any.only': 'Quantity unit must be one of: Items, Boxes, Pieces',
            'any.required': 'Quantity unit is required'
        }),
    
    condition: Joi.when('goodsType', {
        is: Joi.string().valid('ready_to_eat_food', 'emergency_kits', 'medicine', 'bottled_water'),
        then: Joi.string().allow('', null).optional(),
        otherwise: Joi.string()
            .valid('new', 'like_new', 'good', 'fair', 'poor')
            .required()
            .messages({
                'any.only': 'Condition must be one of: new, like_new, good, fair, poor',
                'any.required': 'Condition is required'
            })
    }).custom((value, helpers) => {
        // If goodsType doesn't require condition and condition is empty string or null, convert to undefined
        const goodsType = helpers.state.ancestors[0]?.goodsType;
        const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine', 'bottled_water'];
        if (noConditionTypes.includes(goodsType) && (value === '' || value === null || value === undefined)) {
            return undefined;
        }
        // For items that require condition, ensure it's a valid condition
        if (!noConditionTypes.includes(goodsType) && value && !['new', 'like_new', 'good', 'fair', 'poor'].includes(value)) {
            return helpers.error('any.only');
        }
        return value;
    }),
    
    // Drop-off information
    dropoffLocation: Joi.string()
        .valid('uclm_location', 'pickup', 'other')
        .optional()
        .default('uclm_location')
        .messages({
            'any.only': 'Drop-off location must be one of: uclm_location, pickup, other'
        }),
    
    preferredDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.pattern.base': 'Preferred date must be in YYYY-MM-DD format',
            'any.required': 'Preferred date is required'
        }),
    
    preferredTime: Joi.string()
        .valid(
            '8:00 AM - 10:00 AM',
            '10:00 AM - 12:00 PM',
            '12:00 PM - 2:00 PM',
            '2:00 PM - 4:00 PM',
            '4:00 PM - 6:00 PM'
        )
        .required()
        .messages({
            'any.only': 'Preferred time must be one of the available time slots',
            'any.required': 'Preferred time is required'
        }),
    
    // Preferences
    isAnonymous: Joi.boolean()
        .optional()
        .default(false)
        .messages({
            'boolean.base': 'isAnonymous must be a boolean value'
        }),
    
    showReceipt: Joi.boolean()
        .optional()
        .default(true)
        .messages({
            'boolean.base': 'showReceipt must be a boolean value'
        })
});
