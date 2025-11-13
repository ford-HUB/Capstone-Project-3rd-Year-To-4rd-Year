import React from 'react';
import { Globe, ExternalLink, CheckCircle, AlertCircle, Sparkles, FileSpreadsheet } from 'lucide-react';

const StepFourGoogleFormLink = ({ register, errors, watchedValues }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Google Form & Sheet Links</h3>
        <p className="text-gray-600">Paste your Google Form URL and optionally a Google Sheets URL to connect with the event</p>
      </div>
      
      <div className="group">
        <label htmlFor="form_link" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Google Form Link</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="url"
            {...register('form_link')}
            placeholder="https://docs.google.com/forms/d/..."
            className={`w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
              errors.form_link ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          <ExternalLink className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
          {!errors.form_link && watchedValues.form_link && (
            <CheckCircle className="absolute right-10 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.form_link && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.form_link.message}</span>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-600 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <span>Paste the complete Google Form URL here. Make sure the form is set to accept responses.</span>
        </p>
      </div>

      <div className="group">
        <label htmlFor="sheet_link" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
          <FileSpreadsheet className="w-4 h-4 text-green-500" />
          <span>Google Sheets Link (Optional)</span>
        </label>
        <div className="relative">
          <input
            type="url"
            {...register('sheet_link')}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={`w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
              errors.sheet_link ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          <ExternalLink className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
          {!errors.sheet_link && watchedValues.sheet_link && (
            <CheckCircle className="absolute right-10 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.sheet_link && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.sheet_link.message}</span>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-600 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <span>Optionally paste a Google Sheets URL to store form responses. This helps with data management and analysis.</span>
        </p>
      </div>
    </div>
  );
};

export default StepFourGoogleFormLink;
