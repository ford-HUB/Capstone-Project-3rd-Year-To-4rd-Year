import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useFormStore } from '../../store/common/useFormStore.js';
import Button from '../../components/common/form-builder/field/Button';
import FormInput from '../../components/common/form-builder/field/FormInput';
import FormTextArea from '../../components/common/form-builder/field/FormTextArea';
import FormSelect from '../../components/common/form-builder/field/FormSelect.jsx';
import { submitFormResponse } from '../../services/common/formService.js';
import toast from 'react-hot-toast';

const FormViewerPage = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const { currentForm, loading, getFormById } = useFormStore();
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (formId) {
            getFormById(formId);
        }
    }, [formId, getFormById]);

    const handleInputChange = (fieldId, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const validateForm = () => {
        if (!currentForm?.form_schema?.fields) return false;

        for (const field of currentForm.form_schema.fields) {
            if (field.required && (!formData[field.id] || formData[field.id] === '')) {
                toast.error(`Please fill in the required field: ${field.label}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await submitFormResponse(formId, formData);
            if (response.success) {
                setIsSubmitted(true);
                toast.success('Form submitted successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            key: field.id,
            label: field.label,
            value: formData[field.id] || '',
            onChange: (e) => handleInputChange(field.id, e.target.value),
            required: field.required,
            placeholder: field.placeholder
        };

        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'number':
            case 'date':
                return (
                    <FormInput
                        {...commonProps}
                        type={field.type}
                    />
                );
            case 'textarea':
                return (
                    <FormTextArea
                        {...commonProps}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                );
            case 'select':
                return (
                    <FormSelect
                        {...commonProps}
                        options={field.options?.map(opt => ({ id: opt, value: opt })) || []}
                        onChange={(option) => handleInputChange(field.id, option?.value || '')}
                    />
                );
            case 'radio':
                return (
                    <div key={field.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {field.options?.map((option, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name={field.id}
                                        value={option}
                                        checked={formData[field.id] === option}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={field.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {field.options?.map((option, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={formData[field.id]?.includes(option) || false}
                                        onChange={(e) => {
                                            const currentValues = formData[field.id] || [];
                                            const newValues = e.target.checked
                                                ? [...currentValues, option]
                                                : currentValues.filter(v => v !== option);
                                            handleInputChange(field.id, newValues);
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <FormInput
                        {...commonProps}
                        type="text"
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading form...</p>
                </div>
            </div>
        );
    }

    if (!currentForm) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
                    <p className="text-gray-600 mb-6">The form you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/forms')}>
                        Back to Forms
                    </Button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for your submission. Your response has been recorded successfully.
                    </p>
                    <div className="space-x-4">
                        <Button onClick={() => navigate('/forms')}>
                            Back to Forms
                        </Button>
                        <Button variant="secondary" onClick={() => window.location.reload()}>
                            Submit Another Response
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Form Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {currentForm.title}
                        </h1>
                        {currentForm.description && (
                            <p className="text-gray-600">
                                {currentForm.description}
                            </p>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Created by {currentForm.Accounts?.username}</span>
                                <span>{new Date(currentForm.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {currentForm.form_schema?.fields?.map(renderField)}

                        <div className="pt-6 border-t border-gray-200">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full">
                                {isSubmitting ? 'Submitting...' : 'Submit Form'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormViewerPage;
