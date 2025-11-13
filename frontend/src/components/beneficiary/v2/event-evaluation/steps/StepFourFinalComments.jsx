import React from 'react';

const StepFourFinalComments = ({ control, register, errors }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Final Comments</h3>
        <p className="text-gray-600">Any additional feedback you'd like to share?</p>
      </div>

      <div className="space-y-6">
        {/* Additional Comments */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Comments
          </label>
          <textarea
            {...register('additionalComments')}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share any additional thoughts, suggestions, or feedback..."
          />
          {errors.additionalComments && (
            <p className="text-red-500 text-sm">{errors.additionalComments.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Thank you for taking the time to provide your feedback. Your input helps us improve our events and better serve our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepFourFinalComments;
