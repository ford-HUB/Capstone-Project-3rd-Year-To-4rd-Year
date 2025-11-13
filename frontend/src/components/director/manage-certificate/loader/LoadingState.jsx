import React from 'react';

const LoadingState = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Templates</h3>
      <p className="text-gray-600">Please wait while we fetch your certificate templates...</p>
    </div>
  </div>
);

export default LoadingState;