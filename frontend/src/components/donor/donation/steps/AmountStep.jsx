import React from 'react';

const AmountStep = ({ formData, handleAmountSelect, handleInputChange, errors, presetAmounts }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Amount</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleAmountSelect(amount)}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.amount === amount.toString()
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className="font-bold text-lg">₱{amount.toLocaleString()}</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
          <input
            type="number"
            name="customAmount"
            value={formData.customAmount}
            onChange={handleInputChange}
            placeholder="Enter custom amount"
            className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.customAmount ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>
    </div>
  );
};

export default AmountStep;
