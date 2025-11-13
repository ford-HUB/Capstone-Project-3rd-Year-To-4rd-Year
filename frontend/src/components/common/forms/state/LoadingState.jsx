import React from 'react';

const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

export default LoadingState;
