import React from 'react';
import FormField from '../../../common/participant/profile/fields/FormField';
import TextInput from '../../../common/participant/profile/fields/TextInput';
import { ALL_GOODS_TYPES } from '../../../../constants/goodsTypes.js';

const GoodsStep = ({ formData, handleInputChange, errors, enabledGoodsTypes }) => {
  // Filter goods types based on what's enabled for this event
  // If enabledGoodsTypes is not provided or empty, show all (for backward compatibility)
  const goodsTypes = enabledGoodsTypes && enabledGoodsTypes.length > 0
    ? ALL_GOODS_TYPES.filter(gt => enabledGoodsTypes.includes(gt.id))
    : ALL_GOODS_TYPES;

  const conditions = [
    { id: 'new', label: 'New', description: 'Brand new, unused items' },
    { id: 'like_new', label: 'Like New', description: 'Excellent condition, barely used' },
    { id: 'good', label: 'Good', description: 'Good condition, minor wear' },
    { id: 'fair', label: 'Fair', description: 'Fair condition, some wear but functional' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">What are you donating?</h2>
      
      {/* Goods Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type of Goods *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goodsTypes.map((type) => (
            <label
              key={type.id}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                formData.goodsType === type.id
                  ? `${type.borderColor} ${type.bgColor}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="goodsType"
                value={type.id}
                checked={formData.goodsType === type.id}
                onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <type.icon className={`w-6 h-6 ${type.color}`} />
                <div>
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.goodsType && (
          <p className="text-red-500 text-sm mt-2">{errors.goodsType}</p>
        )}
      </div>

      {/* Description - Only show when goods type is selected */}
      {formData.goodsType && (
        <div className="mb-6">
          <FormField label="Detailed Description" required error={errors?.goodsDescription}>
            <TextInput
              name="goodsDescription"
              value={formData.goodsDescription}
              onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
              placeholder="Describe the items you're donating in detail..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.goodsDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              rows={4}
              as="textarea"
            />
          </FormField>
        </div>
      )}

      {/* Quantity Section - Only show when goods type is selected */}
      {formData.goodsType && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
                placeholder="Enter number"
                min="1"
                step="1"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <select
                name="quantityUnit"
                value={formData.quantityUnit || ''}
                onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.quantityUnit ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select unit</option>
                <option value="Items">Items</option>
                <option value="Boxes">Boxes</option>
                <option value="Pieces">Pieces</option>
              </select>
              {errors.quantityUnit && (
                <p className="text-red-500 text-sm mt-1">{errors.quantityUnit}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Condition - Show only when goods type requires it (non-food, non-emergency, non-medicine) or when no goods type is selected yet */}
      {(!formData.goodsType || !['ready_to_eat_food', 'emergency_kits', 'medicine'].includes(formData.goodsType)) && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition {formData.goodsType ? '*' : ''}
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={(e) => handleInputChange(e.target.name, e.target.value, e.target.type, e.target.checked)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.condition ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select condition</option>
            {conditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.label} - {condition.description}
              </option>
            ))}
          </select>
          {errors.condition && (
            <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
          )}
        </div>
      )}

    </div>
  );
};

export default GoodsStep;
