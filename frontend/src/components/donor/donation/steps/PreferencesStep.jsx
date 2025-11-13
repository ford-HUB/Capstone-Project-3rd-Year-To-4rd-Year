import React from 'react';

const PreferencesStep = ({ formData, handleInputChange }) => {
  const preferences = [
    {
      name: 'isAnonymous',
      label: 'Make this donation anonymous',
      description: 'Your name will not be displayed publicly'
    },
    {
      name: 'showReceipt',
      label: 'Send me a receipt via email',
      description: 'Receive a donation receipt for your records'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
      
      <div className="space-y-4">
        {preferences.map((preference) => (
          <label key={preference.name} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={preference.name}
              checked={formData[preference.name]}
              onChange={handleInputChange}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">{preference.label}</span>
              <p className="text-xs text-gray-500 mt-1">{preference.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PreferencesStep;
