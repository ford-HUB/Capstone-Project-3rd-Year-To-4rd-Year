import React from 'react';
import { Package, MapPin, Calendar, Clock } from 'lucide-react';

const ConfirmationStep = ({ formData, handleInputChange }) => {
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

  const getGoodsTypeLabel = (type) => {
    const types = {
      food: 'Food Items',
      clothing: 'Clothing',
      books: 'Books & Educational',
      toys: 'Toys & Games',
      medical: 'Medical Supplies',
      hygiene: 'Hygiene Items',
      other: 'Other Items'
    };
    return types[type] || type;
  };

  const getGoodsTypesDisplay = (type) => {
    if (!type || type === '') return 'None selected';
    return getGoodsTypeLabel(type);
  };

  const getConditionLabel = (condition) => {
    const conditions = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair'
    };
    return conditions[condition] || condition;
  };

  const getLocationLabel = (locationId) => {
    const locations = {
      uclm_location: 'UCLM Location - Front Gate 1'
    };
    return locations[locationId] || locationId;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmation & Preferences</h2>
      
      {/* Donation Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          Donation Summary
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{getGoodsTypesDisplay(formData.goodsType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{formData.quantity} {formData.quantityUnit || ''}</span>
          </div>
          {formData.condition && (
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">{getConditionLabel(formData.condition)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Drop-off Information */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Drop-off Information
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{getLocationLabel(formData.dropoffLocation)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{formData.preferredTime}</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Preferences</h3>
        {preferences.map((preference) => (
          <label key={preference.name} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={preference.name}
              checked={formData[preference.name]}
              onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
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

export default ConfirmationStep;
