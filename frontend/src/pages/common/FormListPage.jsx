import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus, Calendar, Tag } from 'lucide-react';
import { useFormStore } from '../../store/common/useFormStore.js';
import Button from '../../components/common/form-builder/field/Button';
import { NavLink } from 'react-router-dom';

const FormListPage = () => {
    const { forms, loading, getForms, deleteForm } = useFormStore();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');


    useEffect(() => {
        getForms();
    }, [getForms]);

    const handleDelete = async (formId) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            await deleteForm(formId);
        }
    };

    const filteredForms = forms.filter(form => {
        if (selectedCategory && form.category_id !== parseInt(selectedCategory)) {
            return false;
        }
        if (selectedEvent && form.event_id !== parseInt(selectedEvent)) {
            return false;
        }
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading forms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Form Management</h1>
                            <p className="text-gray-600 mt-1">
                                Manage and view all your created forms
                            </p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/form-builder'}
                            className="bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" />
                            Create New Form
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">All Categories</option>
                                {forms
                                    .filter((form, index, self) => 
                                        form.Category && 
                                        self.findIndex(f => f.Category?.category_id === form.Category.category_id) === index
                                    )
                                    .map(form => (
                                        <option key={form.Category.category_id} value={form.Category.category_id}>
                                            {form.Category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event
                            </label>
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">All Events</option>
                                {forms
                                    .filter((form, index, self) => 
                                        form.Event && 
                                        self.findIndex(f => f.Event?.event_id === form.Event.event_id) === index
                                    )
                                    .map(form => (
                                        <option key={form.Event.event_id} value={form.Event.event_id}>
                                            {form.Event.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedEvent('');
                                }}
                                className="w-full">
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Forms Grid */}
                {filteredForms.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Plus size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                        <p className="text-gray-600 mb-6">
                            {forms.length === 0 
                                ? "You haven't created any forms yet. Create your first form to get started."
                                : "No forms match your current filters. Try adjusting your search criteria."
                            }
                        </p>
                        {forms.length === 0 && (
                            <Button
                                onClick={() => window.location.href = '/form-builder'}
                                className="bg-blue-600 hover:bg-blue-700">
                                <Plus size={16} className="mr-2" />
                                Create Your First Form
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredForms.map((form) => (
                            <div key={form.form_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {form.title}
                                        </h3>
                                        {form.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {form.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => window.location.href = `/form-builder?edit=${form.form_id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(form.form_id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {form.Category && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Tag size={14} className="mr-2" />
                                            {form.Category.name}
                                        </div>
                                    )}
                                    {form.Event && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar size={14} className="mr-2" />
                                            {form.Event.title}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Created {formatDate(form.createdAt)}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            form.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {form.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => window.location.href = `/form/${form.form_id}`}
                                            className="flex-1 text-sm">
                                            <Eye size={14} className="mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            onClick={() => window.location.href = `/form-builder?edit=${form.form_id}`}
                                            className="flex-1 text-sm">
                                            <Edit size={14} className="mr-1" />
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormListPage;
