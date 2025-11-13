import React from 'react';
import { Star } from 'lucide-react';
import { Controller } from 'react-hook-form';

const StepOneExperienceRating = ({ control, errors }) => {
  const renderStarRating = (fieldName, label, required = true) => {
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => field.onChange(rating)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    field.value === rating
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Star className="w-5 h-5" fill={field.value >= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {errors[fieldName] && (
              <p className="text-red-500 text-sm">{errors[fieldName].message}</p>
            )}
          </div>
        )}
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Rate Your Experience</h3>
        <p className="text-gray-600">Help us understand how we did with this event</p>
      </div>

      <div className="space-y-6">
        {renderStarRating('overallRating', 'Overall Experience')}
        {renderStarRating('eventOrganization', 'Event Organization')}
        {renderStarRating('venueQuality', 'Venue Quality')}
        {renderStarRating('staffSupport', 'Staff Support')}
        {renderStarRating('eventContent', 'Event Content')}
      </div>
    </div>
  );
};

export default StepOneExperienceRating;
