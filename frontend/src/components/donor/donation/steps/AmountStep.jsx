import React from 'react';

const AmountStep = ({ formData, handleAmountSelect, handleInputChange, errors, presetAmounts }) => {
  const handleCustomAmountBlur = (e) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Clear invalid values (less than minimum, negative, or empty) on blur
    if (value === '' || isNaN(numValue) || numValue < 10) {
      handleInputChange({
        target: {
          name: 'customAmount',
          value: ''
        }
      });
    }
  };
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
              formData.amount === amount.toString() && !formData.customAmount
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className="font-bold text-lg">₱{amount.toLocaleString()}</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Amount
          </label>
          {formData.amount && (
            <button
              type="button"
              onClick={() => handleAmountSelect(parseFloat(formData.amount))}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Clear selection
            </button>
          )}
        </div>
        <div className="relative">
          <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            formData.amount ? 'text-gray-400' : 'text-gray-500'
          }`}>₱</span>
          <input
            type="number"
            name="customAmount"
            value={formData.customAmount}
            onChange={handleInputChange}
            onBlur={handleCustomAmountBlur}
            onKeyDown={(e) => {
              // Prevent negative sign, minus key, and 'e' (scientific notation)
              if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault();
              }
            }}
            disabled={!!formData.amount}
            min="10"
            step="0.01"
            placeholder={formData.amount ? "Select a preset amount or clear selection" : "Enter custom amount (minimum ₱10)"}
            className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              formData.amount 
                ? 'bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200' 
                : errors.customAmount || errors.amount 
                  ? 'border-red-300' 
                  : 'border-gray-300'
            }`}
          />
        </div>
        {(errors.amount || errors.customAmount) && (
          <p className="text-red-500 text-sm mt-1">{errors.customAmount || errors.amount}</p>
        )}
      </div>
    </div>
  );
};

export default AmountStep;
