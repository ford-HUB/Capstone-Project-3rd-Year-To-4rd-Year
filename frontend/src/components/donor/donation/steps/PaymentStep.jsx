import React from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { asset } from '../../../../assets/asset';
import { getPaymentIcon, getIconComponent } from '../../../../constants/paymentConstants';
import { PAYMENT_METHOD_MAP } from '../../../../constants/paymentMethods';

const PaymentStep = ({ formData, handleInputChange, errors, paymentMethods, paymentAccounts = [], loading = false }) => {
  // Get payment method image or icon using existing constants
  const getPaymentMethodDisplay = (method) => {
    // Use the existing getPaymentIcon function from constants
    const imageSrc = getPaymentIcon(method.id, asset);
    
    // For methods that have specific images (gcash, paymaya, card)
    if (method.id === 'gcash' || method.id === 'paymaya' || method.id === 'card') {
      return <img src={imageSrc} alt={method.name} className="w-6 h-6 object-contain" />;
    }
    
    // For bank methods, use icon components
    const IconComponent = getIconComponent(method.icon, { CreditCard, Smartphone, Building });
    return <IconComponent className={`w-6 h-6 ${method.color || 'text-gray-600'}`} />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading payment methods...</span>
        </div>
      </div>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No payment methods available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((method) => {
          return (
            <label
              key={method.id}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.paymentMethod === method.id
                  ? `${PAYMENT_METHOD_MAP[method.id]?.borderColor || method.borderColor} ${PAYMENT_METHOD_MAP[method.id]?.bgColor || method.bgColor} shadow-md`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.paymentMethod === method.id}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {getPaymentMethodDisplay(method)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
                {formData.paymentMethod === method.id && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {errors.paymentMethod && (
        <p className="text-red-500 text-sm mb-4">{errors.paymentMethod}</p>
      )}

  
    </div>
  );
};

export default PaymentStep;
