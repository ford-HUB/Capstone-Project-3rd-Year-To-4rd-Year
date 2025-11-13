import Joi from "joi";

export const certificateTemplateSchema = Joi.object({
    category_name: Joi.string()
        .valid(
            'School', 'Community',
            'Emergency', 'Donation Drive',
            'Charity', 'Relief Pogram',
            'Health', 'Outreach',
            'Training', 'Seminar', 'Others'
        )
        .required()
        .messages({
            'any.required': 'Category name is required',
            'any.only': 'Invalid category name',
            'string.base': 'Category name must be a string',
        }),

    ct_name: Joi.string().required().messages({
        'any.required': 'Certificate name is required',
        'string.base': 'Certificate name must be a string',
    }),

    selected_raw_ct: Joi.alternatives()
        .try(
            Joi.array().items(Joi.string().min(1)), // if it's an array of strings
            Joi.string().min(1) // or just a single string
        )
        .required()
        .messages({
            'any.required': 'Selected raw certificate type is required',
            'array.base':
                'Selected raw certificate type must be an array or string',
        }),
});
