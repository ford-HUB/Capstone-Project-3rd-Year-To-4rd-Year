import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSubmissionSchema } from '../../../forms/SubmissionSchema.js';
import toast from 'react-hot-toast';

const SubmissionForm = ({ onSubmit, loading, departments, userDepartment }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(createSubmissionSchema),
        defaultValues: {
            title: '',
            description: '',
            submission_type: '',
            department_id: userDepartment?.department_id || '',
            file: null
        }
    });

    const watchedDepartmentId = watch('department_id');

    // Set default department if user has one
    useEffect(() => {
        if (userDepartment?.department_id && !watchedDepartmentId) {
            setValue('department_id', userDepartment.department_id);
        }
    }, [userDepartment, watchedDepartmentId, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setValue('file', file);
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setFilePreview(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setValue('file', null);
    };

    const onFormSubmit = (data) => {
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }
        
        onSubmit({
            ...data,
            file: selectedFile
        });
    };

    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return '🖼️';
        if (fileType?.includes('pdf')) return '📄';
        if (fileType?.includes('word')) return '📝';
        if (fileType?.includes('excel') || fileType?.includes('sheet')) return '📊';
        return '📁';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                    Submit New File
                </h2>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        {...register('title')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter submission title"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.title.message}
                        </p>
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
                        placeholder="Provide additional details about this submission..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Submission Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submission Type *
                    </label>
                    <select
                        {...register('submission_type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select submission type</option>
                        <option value="Annual">Annual</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Special">Special</option>
                        <option value="Compliance">Compliance</option>
                    </select>
                    {errors.submission_type && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.submission_type.message}
                        </p>
                    )}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                    </label>
                    <select
                        {...register('department_id', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!!userDepartment?.department_id}
                    >
                        <option value="">Select department</option>
                        {departments?.map((dept) => (
                            <option key={dept.department_id} value={dept.department_id}>
                                {dept.department_name}
                            </option>
                        ))}
                    </select>
                    {errors.department_id && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.department_id.message}
                        </p>
                    )}
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        File *
                    </label>
                    
                    {!selectedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PDF, Word, Excel, or images (max 10MB)
                                </p>
                            </label>
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {filePreview && (
                                <div className="mt-3">
                                    <img
                                        src={filePreview}
                                        alt="Preview"
                                        className="max-w-full h-32 object-contain rounded border"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {errors.file && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.file.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            setSelectedFile(null);
                            setFilePreview(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        {loading ? 'Submitting...' : 'Submit File'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmissionForm;
