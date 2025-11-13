import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Download, Copy, Check, Upload, Save } from 'lucide-react';
import TabNavigation from '../../components/common/form-builder/navigation/TabNavigation';
import Button from '../../components/common/form-builder/field/Button';
import FormInput from '../../components/common/form-builder/field/FormInput';
import FormTextArea from '../../components/common/form-builder/field/FormTextArea';
import FieldTypeButton from '../../components/common/form-builder/field/FieldTypeButton';
import EmptyState from '../../components/common/form-builder/state/EmptyState.jsx';
import PreviewField from '../../components/common/form-builder/ui/PreviewField';
import { FIELD_TYPES } from '../../constants/formBuilder.js';
import FieldEditor from '../../components/common/form-builder/ui/FieldEditor.jsx';
import FormSelect from '../../components/common/form-builder/field/FormSelect.jsx';
import { useFormStore } from '../../store/common/useFormStore.js';

const FormBuilder = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState([]);
    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [formDescription, setFormDescription] = useState('');
    const [activeTab, setActiveTab] = useState('builder');
    const [copiedJSON, setCopiedJSON] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [targetRole, setTargetRole] = useState('volunteer');
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingFormId, setEditingFormId] = useState(null);

    // Zustand store
    const { 
        categories, 
        events, 
        loading, 
        createForm, 
        updateForm,
        getCategories, 
        getEvents 
    } = useFormStore();

    // Load categories and events on component mount
    useEffect(() => {
        getCategories();
        getEvents();
    }, [getCategories, getEvents]);

    // Check for editing form data on component mount
    useEffect(() => {
        const editingFormData = sessionStorage.getItem('editingForm');
        if (editingFormData) {
            try {
                const form = JSON.parse(editingFormData);
                setIsEditing(true);
                setEditingFormId(form.form_id);
                setFormTitle(form.title || 'Untitled Form');
                setFormDescription(form.description || '');
                
                
                // Set category if available
                if (form.category_id) {
                    const category = categories.find(cat => cat.category_id === form.category_id);
                    if (category) {
                        setSelectedCategory({ id: category.category_id, value: category.name });
                    }
                }
                
                // Set event if available
                if (form.event_id) {
                    const event = events.find(evt => evt.event_id === form.event_id);
                    if (event) {
                        setSelectedEvent({ id: event.event_id, value: event.title });
                    }
                }
                
                // Set target role if available
                if (form.target_role) {
                    setTargetRole(form.target_role);
                }
                
                // Set form fields if available
                if (form.form_schema && form.form_schema.fields) {
                    setFormFields(form.form_schema.fields);
                }
                
                // Clear the session storage after loading
                sessionStorage.removeItem('editingForm');
            } catch (error) {
                console.error('Error parsing editing form data:', error);
            }
        }
    }, [categories, events]);

    // Field creation utility
    const createField = (type) => ({
        id: Date.now() + Math.random(),
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        placeholder:
            type === 'textarea' ? 'Enter your response...' : `Enter ${type}...`,
        required: false,
        description: '',
        options: ['select', 'radio'].includes(type)
            ? ['Option 1', 'Option 2']
            : undefined,
        validation: type === 'number' ? { min: '', max: '' } : undefined,
    });

    // Field operations
    const addField = (type) =>
        setFormFields((prev) => [...prev, createField(type)]);

    const updateField = (fieldId, property, value) => {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === fieldId ? { ...field, [property]: value } : field
            )
        );
    };

    const updateValidation = (fieldId, validationKey, value) => {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === fieldId
                    ? {
                          ...field,
                          validation: {
                              ...field.validation,
                              [validationKey]: value,
                          },
                      }
                    : field
            )
        );
    };

    const updateOption = (fieldId, optionIndex, value) => {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === fieldId
                    ? {
                          ...field,
                          options: field.options.map((opt, idx) =>
                              idx === optionIndex ? value : opt
                          ),
                      }
                    : field
            )
        );
    };

    const removeOption = (fieldId, optionIndex) => {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === fieldId
                    ? {
                          ...field,
                          options: field.options.filter(
                              (_, idx) => idx !== optionIndex
                          ),
                      }
                    : field
            )
        );
    };

    const addOption = (fieldId) => {
        setFormFields((fields) =>
            fields.map((field) =>
                field.id === fieldId
                    ? {
                          ...field,
                          options: [
                              ...field.options,
                              `Option ${field.options.length + 1}`,
                          ],
                      }
                    : field
            )
        );
    };

    const removeField = (fieldId) => {
        setFormFields((fields) =>
            fields.filter((field) => field.id !== fieldId)
        );
    };

    const moveField = (fieldId, direction) => {
        const currentIndex = formFields.findIndex(
            (field) => field.id === fieldId
        );
        const newIndex =
            direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= formFields.length) return;

        const newFields = [...formFields];
        [newFields[currentIndex], newFields[newIndex]] = [
            newFields[newIndex],
            newFields[currentIndex],
        ];
        setFormFields(newFields);
    };

    // JSON operations
    const generateJSON = () => ({
        title: formTitle,
        description: formDescription,
        fields: formFields.map((field) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            required: field.required,
            description: field.description,
            ...(field.options && { options: field.options }),
            ...(field.validation && { validation: field.validation }),
        })),
        createdAt: new Date().toISOString(),
    });

    const copyJSON = async () => {
        const json = JSON.stringify(generateJSON(), null, 2);
        await navigator.clipboard.writeText(json);
        setCopiedJSON(true);
        setTimeout(() => setCopiedJSON(false), 2000);
    };

    const downloadJSON = () => {
        const json = JSON.stringify(generateJSON(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formTitle
            .toLowerCase()
            .replace(/\s+/g, '-')}-form.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveForm = async () => {
        if (!formTitle.trim()) {
            alert('Please enter a form title');
            return;
        }

        if (formFields.length === 0) {
            alert('Please add at least one field to the form');
            return;
        }

        setIsSaving(true);
        
        try {
            const formData = {
                title: formTitle,
                description: formDescription,
                category_id: selectedCategory?.id || null,
                event_id: selectedEvent?.id || null,
                target_role: targetRole,
                form_schema: {
                    title: formTitle,
                    description: formDescription,
                    fields: formFields.map((field) => ({
                        id: field.id,
                        type: field.type,
                        label: field.label,
                        placeholder: field.placeholder,
                        required: field.required,
                        description: field.description,
                        ...(field.options && { options: field.options }),
                        ...(field.validation && { validation: field.validation }),
                    })),
                    createdAt: new Date().toISOString(),
                }
            };

            let success;
            if (isEditing && editingFormId) {
                // Update existing form
                success = await updateForm(editingFormId, formData);
            } else {
                // Create new form
                success = await createForm(formData);
            }

            if (success) {
                // Reset form after successful save
                setFormTitle('Untitled Form');
                setFormDescription('');
                setFormFields([]);
                setSelectedCategory(null);
                setSelectedEvent(null);
                setTargetRole('volunteer'); // Reset to default
                setIsEditing(false);
                setEditingFormId(null);
                
                // Navigate back to forms list
                navigate('/director/form-list');
            }
        } catch (error) {
            console.error('Error saving form:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Transform categories and events for dropdown
    const categoryOptions = categories.map(cat => ({
        id: cat.category_id,
        value: cat.name
    }));

    const eventOptions = events.map(event => ({
        id: event.event_id,
        value: event.title
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditing ? 'Edit Form' : 'Form Builder'}
                            </h1>
                            <p className="text-gray-600">
                                {isEditing ? 'Edit your form and save changes' : 'Create dynamic forms and export as JSON'}
                            </p>
                        </div>

                        <TabNavigation
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        <div className="flex space-x-2">
                            <Button
                                variant="secondary"
                                onClick={copyJSON}>
                                {copiedJSON ? (
                                    <Check
                                        size={16}
                                        className="mr-2"
                                    />
                                ) : (
                                    <Copy
                                        size={16}
                                        className="mr-2"
                                    />
                                )}
                                {copiedJSON ? 'Copied!' : 'Copy JSON'}
                            </Button>
                            <Button onClick={downloadJSON}>
                                <Download
                                    size={16}
                                    className="mr-2"
                                />
                                Download
                            </Button>

                            <Button
                                className="bg-green-600"
                                onClick={handleSaveForm}
                                disabled={isSaving || loading}>
                                <Save
                                    size={16}
                                    className="mr-2"
                                />
                                {isSaving ? 'Saving...' : (isEditing ? 'Update Form' : 'Save Form')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Builder Tab */}
                {activeTab === 'builder' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Form Settings */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <h3 className="font-semibold text-lg mb-4">
                                    Form Settings
                                </h3>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Form Title"
                                        value={formTitle}
                                        onChange={(e) =>
                                            setFormTitle(e.target.value)
                                        }
                                    />
                                    <FormTextArea
                                        label="Description"
                                        value={formDescription}
                                        onChange={(e) =>
                                            setFormDescription(e.target.value)
                                        }
                                        placeholder="Brief description of this form..."
                                    />

                                    <div className="space-y-4">
                                        <FormSelect
                                            label="Category (Optional)"
                                            placeholder="Choose a category"
                                            options={categoryOptions}
                                            value={selectedCategory}
                                            onChange={(option) => setSelectedCategory(option)}
                                        />
                                        
                                        <FormSelect
                                            label="Event (Optional)"
                                            placeholder="Choose an event"
                                            options={eventOptions}
                                            value={selectedEvent}
                                            onChange={(option) => setSelectedEvent(option)}
                                        />
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Target Role *
                                            </label>
                                            <select
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="volunteer">Volunteer</option>
                                                <option value="beneficiary">Beneficiary</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Select who this form is intended for
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Field Types */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-lg mb-4">
                                    Available Fields
                                </h3>
                                <div className="space-y-2">
                                    {FIELD_TYPES.map((fieldType) => (
                                        <FieldTypeButton
                                            key={fieldType.type}
                                            fieldType={fieldType}
                                            onAdd={addField}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Builder */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-lg mb-6">
                                    Form Fields
                                </h3>

                                {formFields.length === 0 ? (
                                    <EmptyState
                                        title="No fields added yet"
                                        description="Click on a field type from the left panel to get started"
                                        icon={Plus}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {formFields.map((field, index) => (
                                            <FieldEditor
                                                key={field.id}
                                                field={field}
                                                index={index}
                                                totalFields={formFields.length}
                                                onUpdate={updateField}
                                                onUpdateValidation={
                                                    updateValidation
                                                }
                                                onUpdateOption={updateOption}
                                                onRemoveOption={removeOption}
                                                onAddOption={addOption}
                                                onMove={moveField}
                                                onRemove={removeField}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {formTitle}
                                </h2>
                                {formDescription && (
                                    <p className="text-gray-600">
                                        {formDescription}
                                    </p>
                                )}
                            </div>

                            {formFields.length === 0 ? (
                                <EmptyState
                                    title="No fields to preview"
                                    description="Add some fields in the builder to see the preview"
                                    icon={Eye}
                                />
                            ) : (
                                <div className="space-y-6">
                                    {formFields.map((field) => (
                                        <PreviewField
                                            key={field.id}
                                            field={field}
                                        />
                                    ))}
                                    <Button className="w-full">
                                        Submit Form
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* JSON Tab */}
                {activeTab === 'json' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">
                                    Generated JSON
                                </h3>
                                <div className="text-sm text-gray-500">
                                    Fields: {formFields.length}
                                </div>
                            </div>
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>
                                    {JSON.stringify(generateJSON(), null, 2)}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormBuilder;
