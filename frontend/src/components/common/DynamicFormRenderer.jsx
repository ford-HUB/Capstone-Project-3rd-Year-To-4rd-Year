import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateDynamicFormSchema, generateDefaultValues, FIELD_TYPES } from '../../forms/DynamicFormSchema.js';
import StarRating from '../participant/v2/event-feedback-evaluation/ui/StarRating.jsx';

// Import styled dynamic field components
import DynamicInputField from './dynamic-fields/DynamicInputField.jsx';
import DynamicTextAreaField from './dynamic-fields/DynamicTextAreaField.jsx';
import DynamicSelectField from './dynamic-fields/DynamicSelectField.jsx';
import DynamicRadioGroup from './dynamic-fields/DynamicRadioGroup.jsx';
import DynamicCheckboxField from './dynamic-fields/DynamicCheckboxField.jsx';
import DynamicFileField from './dynamic-fields/DynamicFileField.jsx';
import DynamicStepHeader from './dynamic-fields/DynamicStepHeader.jsx';

const DynamicFormRenderer = ({ 
    formSchema, 
    onSubmit, 
    isSubmitting = false,
    defaultValues = null,
    className = "",
    register = null,
    control = null,
    errors = {},
    formId = null // Add formId to create proper field keys
}) => {
    if (!formSchema || !formSchema.fields) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No form fields available.</p>
            </div>
        );
    }

    // Use passed register and control if available, otherwise create own form
    const useOwnForm = !register || !control;
    
    const ownForm = useOwnForm ? useForm({
        resolver: zodResolver(generateDynamicFormSchema(formSchema.fields)),
        defaultValues: defaultValues || generateDefaultValues(formSchema.fields)
    }) : null;

    const formRegister = register || ownForm?.register;
    const formControl = control || ownForm?.control;
    const formErrors = errors || ownForm?.formState?.errors || {};
    const formHandleSubmit = ownForm?.handleSubmit;

    const renderField = (field) => {
        // Create proper field key with formId prefix if available
        const fieldId = formId ? `${formId}_${String(field.id)}` : String(field.id);
        const fieldError = formErrors[fieldId];
        const isRequired = field.required;

        switch (field.type) {
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.EMAIL:
                return (
                    <DynamicInputField
                        key={field.id}
                        label={field.label}
                        type={field.type}
                        error={fieldError?.message}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        required={isRequired}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.NUMBER:
                return (
                    <DynamicInputField
                        key={field.id}
                        label={field.label}
                        type="number"
                        error={fieldError?.message}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        required={isRequired}
                        {...formRegister(fieldId, { valueAsNumber: true })}
                    />
                );

            case FIELD_TYPES.TEXTAREA:
                return (
                    <DynamicTextAreaField
                        key={field.id}
                        label={field.label}
                        error={fieldError?.message}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        required={isRequired}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.SELECT:
                return (
                    <DynamicSelectField
                        key={field.id}
                        label={field.label}
                        error={fieldError?.message}
                        placeholder={`Select ${field.label.toLowerCase()}`}
                        required={isRequired}
                        options={field.options || []}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.RADIO:
                return (
                    <DynamicRadioGroup
                        key={field.id}
                        label={field.label}
                        error={fieldError?.message}
                        required={isRequired}
                        options={field.options || []}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.CHECKBOX:
                return (
                    <DynamicCheckboxField
                        key={field.id}
                        label={field.label}
                        error={fieldError?.message}
                        required={isRequired}
                        options={field.options || []}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.FILE:
                return (
                    <DynamicFileField
                        key={field.id}
                        label={field.label}
                        error={fieldError?.message}
                        required={isRequired}
                        {...formRegister(fieldId)}
                    />
                );

            case FIELD_TYPES.RATING:
                return (
                    <Controller
                        key={field.id}
                        name={fieldId}
                        control={formControl}
                        render={({ field: controllerField }) => (
                            <StarRating
                                rating={controllerField.value || 0}
                                onRatingChange={controllerField.onChange}
                                label={field.label}
                                error={fieldError?.message}
                            />
                        )}
                    />
                );

            default:
                return (
                    <DynamicInputField
                        key={field.id}
                        label={field.label}
                        type="text"
                        error={fieldError?.message}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        required={isRequired}
                        {...formRegister(fieldId)}
                    />
                );
        }
    };

    // If using own form, wrap in form element, otherwise just render fields
    if (useOwnForm) {
        return (
            <form onSubmit={formHandleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
                <div className="space-y-4">
                    {formSchema.fields.map(renderField)}
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        );
    } else {
        // Just render fields without form wrapper when integrated with parent form
        return (
            <div className={`space-y-4 ${className}`}>
                {formSchema.fields.map(renderField)}
            </div>
        );
    }
};

export default DynamicFormRenderer;
