import React from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

const StepThreeFormDetails = ({ register, errors, watchedValues }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Form Details</h3>
        <p className="text-gray-600">Provide a title and description for your form</p>
      </div>
      
      <div className="group">
        <label htmlFor="title" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
          <FileText className="w-4 h-4 text-blue-500" />
          <span>Form Title</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            {...register('title')}
            placeholder="Enter a descriptive title for your form"
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {!errors.title && watchedValues.title && (
            <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.title && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.title.message}</span>
          </div>
        )}
      </div>

      <div className="group">
        <label htmlFor="description" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
          <FileText className="w-4 h-4 text-blue-500" />
          <span>Description</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe what this form is for and what participants should expect..."
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {!errors.description && watchedValues.description && (
            <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.description && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.description.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepThreeFormDetails;
