import React from 'react';

const StepThreeFutureEngagement = ({ control, register, errors }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Future Engagement</h3>
        <p className="text-gray-600">Help us plan for the future</p>
      </div>

      <div className="space-y-6">
        {/* Would Recommend */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Would you recommend this event to others? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('wouldRecommend')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="Definitely">Definitely</option>
            <option value="Probably">Probably</option>
            <option value="Maybe">Maybe</option>
            <option value="Probably Not">Probably Not</option>
            <option value="Definitely Not">Definitely Not</option>
          </select>
          {errors.wouldRecommend && (
            <p className="text-red-500 text-sm">{errors.wouldRecommend.message}</p>
          )}
        </div>

        {/* Future Participation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Would you participate in similar events in the future? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('futureParticipation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="Yes, definitely">Yes, definitely</option>
            <option value="Yes, probably">Yes, probably</option>
            <option value="Maybe">Maybe</option>
            <option value="Probably not">Probably not</option>
            <option value="No">No</option>
          </select>
          {errors.futureParticipation && (
            <p className="text-red-500 text-sm">{errors.futureParticipation.message}</p>
          )}
        </div>

        {/* Share Testimonial */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('shareTestimonial')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            I would like to share my testimonial for this event
          </label>
          {errors.shareTestimonial && (
            <p className="text-red-500 text-sm">{errors.shareTestimonial.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepThreeFutureEngagement;
