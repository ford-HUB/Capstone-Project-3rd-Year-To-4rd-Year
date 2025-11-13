import React from 'react';
import { Calendar, Users, FileText, Globe, FileSpreadsheet } from 'lucide-react';

const StepFiveReview = ({ watchedValues, events }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
        <p className="text-gray-600">Review your form details before creating the link</p>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Event</p>
            <p className="text-gray-900">
              {events.find(e => e.event_id === parseInt(watchedValues.event_id))?.title || 'No event selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Target Role</p>
            <p className="text-gray-900 capitalize">{watchedValues.target_role || 'No role selected'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Form Title</p>
            <p className="text-gray-900">{watchedValues.title || 'No title provided'}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-900">{watchedValues.description || 'No description provided'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Google Form Link</p>
            <p className="text-gray-900 break-all">{watchedValues.form_link || 'No link provided'}</p>
          </div>
        </div>
        
        {watchedValues.sheet_link && (
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Google Sheets Link</p>
              <p className="text-gray-900 break-all">{watchedValues.sheet_link}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepFiveReview;
