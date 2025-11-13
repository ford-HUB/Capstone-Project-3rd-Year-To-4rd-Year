import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { useFormStore } from '../../store/common/useFormStore.js';
import toast from 'react-hot-toast';

const FIELD_TYPES = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'file', label: 'File Upload' },
    { value: 'rating', label: 'Star Rating' }
];

const formSchema = z.object({
    title: z.string().min(1, 'Form title is required'),
    description: z.string().optional(),
    category_id: z.number().optional(),
    event_id: z.number().optional(),
});

const DynamicFormBuilder = ({ onFormCreated, initialForm = null }) => {
    const [formFields, setFormFields] = useState([]);
    const [editingField, setEditingField] = useState(null);
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createForm, categories, events, getCategories, getEvents } = useFormStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialForm?.title || '',
            description: initialForm?.description || '',
            category_id: initialForm?.category_id || '',
            event_id: initialForm?.event_id || '',
        }
    });

    // Load categories and events
    useEffect(() => {
        getCategories();
        getEvents();
    }, [getCategories, getEvents]);

    // Load initial form fields if editing
    useEffect(() => {
        if (initialForm?.form_schema?.fields) {
            setFormFields(initialForm.form_schema.fields);
        }
    }, [initialForm]);

    const addField = (fieldData) => {
        const newField = {
            id: `field_${Date.now()}`,
            type: fieldData.type,
            label: fieldData.label,
            placeholder: fieldData.placeholder || '',
            required: fieldData.required || false,
            options: fieldData.options || [],
            validation: fieldData.validation || {}
        };

        if (editingField !== null) {
            // Edit existing field
            const updatedFields = [...formFields];
            updatedFields[editingField] = newField;
            setFormFields(updatedFields);
            setEditingField(null);
        } else {
            // Add new field
            setFormFields([...formFields, newField]);
        }
        setShowFieldModal(false);
    };

    const editField = (index) => {
        setEditingField(index);
        setShowFieldModal(true);
    };

    const deleteField = (index) => {
        setFormFields(formFields.filter((_, i) => i !== index));
    };

    const moveField = (index, direction) => {
        const newFields = [...formFields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newFields.length) {
            [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
            setFormFields(newFields);
        }
    };

    const onSubmit = async (formData) => {
        if (formFields.length === 0) {
            toast.error('Please add at least one field to the form');
            return;
        }

        setIsSubmitting(true);
        try {
            const formSchema = {
                fields: formFields
            };

            const success = await createForm({
                ...formData,
                form_schema: formSchema
            });

            if (success) {
                toast.success('Form created successfully!');
                onFormCreated?.();
            }
        } catch (error) {
            console.error('Error creating form:', error);
            toast.error('Failed to create form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {initialForm ? 'Edit Dynamic Form' : 'Create Dynamic Form'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Form Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Form Title *
                            </label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter form title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                {...register('category_id', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event
                            </label>
                            <select
                                {...register('event_id', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Event</option>
                                {events.map(event => (
                                    <option key={event.event_id} value={event.event_id}>
                                        {event.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter form description"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Form Fields</h3>
                            <button
                                type="button"
                                onClick={() => setShowFieldModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Field
                            </button>
                        </div>

                        {formFields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No fields added yet. Click "Add Field" to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {index + 1}.
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {field.label}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({FIELD_TYPES.find(t => t.value === field.type)?.label})
                                                </span>
                                                {field.required && (
                                                    <span className="text-red-500 text-sm">*</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => moveField(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveField(index, 'down')}
                                                disabled={index === formFields.length - 1}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => editField(index)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteField(index)}
                                                className="p-1 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Creating...' : 'Create Form'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Field Modal */}
            {showFieldModal && (
                <FieldModal
                    fieldTypes={FIELD_TYPES}
                    onSave={addField}
                    onCancel={() => {
                        setShowFieldModal(false);
                        setEditingField(null);
                    }}
                    initialField={editingField !== null ? formFields[editingField] : null}
                />
            )}
        </div>
    );
};

// Field Modal Component
const FieldModal = ({ fieldTypes, onSave, onCancel, initialField = null }) => {
    const [fieldData, setFieldData] = useState({
        type: initialField?.type || 'text',
        label: initialField?.label || '',
        placeholder: initialField?.placeholder || '',
        required: initialField?.required || false,
        options: initialField?.options || [],
        validation: initialField?.validation || {}
    });

    const [newOption, setNewOption] = useState('');

    const addOption = () => {
        if (newOption.trim()) {
            setFieldData({
                ...fieldData,
                options: [...fieldData.options, newOption.trim()]
            });
            setNewOption('');
        }
    };

    const removeOption = (index) => {
        setFieldData({
            ...fieldData,
            options: fieldData.options.filter((_, i) => i !== index)
        });
    };

    const handleSave = () => {
        if (!fieldData.label.trim()) {
            toast.error('Field label is required');
            return;
        }
        onSave(fieldData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {initialField ? 'Edit Field' : 'Add Field'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Type
                        </label>
                        <select
                            value={fieldData.type}
                            onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {fieldTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Label *
                        </label>
                        <input
                            type="text"
                            value={fieldData.label}
                            onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter field label"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Placeholder
                        </label>
                        <input
                            type="text"
                            value={fieldData.placeholder}
                            onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter placeholder text"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="required"
                            checked={fieldData.required}
                            onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="required" className="text-sm font-medium text-gray-700">
                            Required field
                        </label>
                    </div>

                    {/* Options for select, radio, checkbox */}
                    {(fieldData.type === 'select' || fieldData.type === 'radio' || fieldData.type === 'checkbox') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options
                            </label>
                            <div className="space-y-2">
                                {fieldData.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-md">
                                            {option}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addOption()}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add option"
                                    />
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {initialField ? 'Update' : 'Add'} Field
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormBuilder;
