import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Save, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useAuthStore } from '../../store/director/useAuthStore.js';
import useRequirementsStore from '../../store/common/useRequirementsStore.js';
import DeleteRequirementModal from '../../components/modal/DeleteRequirementModal.jsx';

// Form validation schema
const requirementSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    category: z.string().min(1, 'Category is required'),
    isRequired: z.boolean().default(true)
});

const PostRequirements = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        open: false,
        requirement: null
    });
    
    const { authenticatedDirector } = useAuthStore();
    const { 
        requirements, 
        loading, 
        fetchAllRequirements, 
        createRequirement, 
        updateRequirement, 
        deleteRequirement 
    } = useRequirementsStore();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(requirementSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            category: '',
            isRequired: true
        }
    });

    // Load existing requirements on component mount
    useEffect(() => {
        const loadRequirements = async () => {
            try {
                await fetchAllRequirements();
            } catch (error) {
                console.error('Error loading requirements:', error);
                toast.error('Failed to load requirements');
            }
        };
        
        loadRequirements();
    }, [fetchAllRequirements]);

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                // Update existing requirement
                await updateRequirement(editingId, data);
            } else {
                // Create new requirement
                await createRequirement(data);
            }
            
            reset();
            setIsEditing(false);
            setEditingId(null);
            
        } catch (error) {
            console.error('Error saving requirement:', error);
            toast.error('Failed to save requirement');
        }
    };

    const handleEdit = (requirement) => {
        setValue('title', requirement.title);
        setValue('description', requirement.description || '');
        setValue('dueDate', requirement.due_date);
        setValue('category', requirement.category);
        setValue('isRequired', requirement.is_required);
        setIsEditing(true);
        setEditingId(requirement.requirement_id);
    };

    const handleDelete = (requirement) => {
        setConfirmationModal({
            open: true,
            requirement: requirement
        });
    };

    const handleConfirmDelete = async (requirement) => {
        try {
            await deleteRequirement(requirement.requirement_id);
            toast.success('Requirement deleted successfully');
            setConfirmationModal({ open: false, requirement: null });
        } catch (error) {
            console.error('Error deleting requirement:', error);
            toast.error('Failed to delete requirement');
        }
    };

    const cancelEdit = () => {
        reset();
        setIsEditing(false);
        setEditingId(null);
    };

    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'annual report':
                return 'bg-red-100 text-red-800';
            case 'monthly report':
                return 'bg-blue-100 text-blue-800';
            case 'financial statement':
                return 'bg-green-100 text-green-800';
            case 'compliance document':
                return 'bg-orange-100 text-orange-800';
            case 'special':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Post Submission Requirements
                    </h1>
                    <p className="text-gray-600">
                        Create and manage monthly/annual submission requirements for staff and coordinators
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-6">
                            <Plus className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isEditing ? 'Edit Requirement' : 'Add New Requirement'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirement Title *
                                </label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Annual Report, Monthly Financial Statement"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provide detailed instructions or requirements..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    {...register('dueDate')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.dueDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Annual Report">Annual Report</option>
                                    <option value="Monthly Report">Monthly Report</option>
                                    <option value="Financial Statement">Financial Statement</option>
                                    <option value="Compliance Document">Compliance Document</option>
                                    <option value="Special">Special</option>
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                )}
                            </div>

                            {/* Required Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('isRequired')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    This is a required submission
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : (isEditing ? 'Update Requirement' : 'Post Requirement')}
                                </button>
                                
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Requirements List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Current Requirements
                                </h2>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {requirements.length} active
                            </span>
                        </div>

                        {loading && requirements.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-500">Loading requirements...</p>
                            </div>
                        ) : requirements.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No requirements posted
                                </h3>
                                <p className="text-gray-500">
                                    Start by adding your first submission requirement
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requirements.map((requirement) => (
                                    <div
                                        key={requirement.requirement_id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {requirement.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(requirement.category)}`}>
                                                        {requirement.category}
                                                    </span>
                                                    {requirement.is_required && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {requirement.description && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {requirement.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        Due: {dayjs(requirement.due_date).format('MMM D, YYYY')}
                                                    </div>
                                                    <div>
                                                        Posted: {dayjs(requirement.created_at).format('MMM D, YYYY')}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleEdit(requirement)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit requirement"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(requirement)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete requirement"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteRequirementModal
                open={confirmationModal.open}
                setOpen={(open) => setConfirmationModal({ open, requirement: null })}
                onConfirm={handleConfirmDelete}
                requirement={confirmationModal.requirement}
            />
        </div>
    );
};

export default PostRequirements;
