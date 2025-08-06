import Joi from "joi";

export const certificateTemplateSchema = Joi.object({
    html_raw_template: Joi.string().trim().min(10).required().custom((value, helpers) => {
        if (!value.includes('{{name}}')) { return helpers.message('Template must include {{name}} placeholder.') }
        return value }).messages({
        'string.base': 'HTML content must be a string.',
        'string.empty': 'HTML content cannot be empty.',
        'any.required': 'HTML content is required.',
    }),

    default_cert_title: Joi.string().allow(null, '').default('Certificate of Completion').messages({
        'string.base': 'Default title must be a string.',
    }),
});
