import React from 'react';
import { X } from "lucide-react";

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md">
      <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <X className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Templates</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorState;