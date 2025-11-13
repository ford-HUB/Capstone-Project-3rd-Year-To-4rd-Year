import React from 'react';

const StepTwoDetailedFeedback = ({ register, errors }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Your Thoughts</h3>
        <p className="text-gray-600">Tell us what worked and what didn't</p>
      </div>

      <div className="space-y-6">
        {/* Most Helpful */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What was most helpful about this event?
          </label>
          <textarea
            {...register('mostHelpful')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share what you found most valuable..."
          />
          {errors.mostHelpful && (
            <p className="text-red-500 text-sm">{errors.mostHelpful.message}</p>
          )}
        </div>

        {/* Least Helpful */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What could have been better?
          </label>
          <textarea
            {...register('leastHelpful')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share areas for improvement..."
          />
          {errors.leastHelpful && (
            <p className="text-red-500 text-sm">{errors.leastHelpful.message}</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Suggestions for future events
          </label>
          <textarea
            {...register('suggestions')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your ideas for improvement..."
          />
          {errors.suggestions && (
            <p className="text-red-500 text-sm">{errors.suggestions.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwoDetailedFeedback;
