import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-green-100">Your evaluation has been submitted successfully</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Your feedback is valuable to us
            </h3>
            <p className="text-green-700">
              We appreciate you taking the time to share your experience. Your input helps us improve our events and better serve our community.
            </p>
          </div>
          
          <div className="text-gray-600">
            <p className="mb-2">You will be redirected to your dashboard shortly...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
