import React, { useState, useEffect } from 'react';
import { CircleX, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { asset } from '../../assets/asset.jsx';
import { usePaymentStore } from '../../store/director/usePaymentStore.js';

const PaymentFields = ({ open, setOpen, onComplete }) => {
  const { createPaymentLink, isLoading, selectedPaymentMethod, paymentMethods: existingPaymentMethods, getPaymentMethods, availableMethods } = usePaymentStore();
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);

  const allPaymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      icon: asset.gcash,
      description: 'Pay with GCash wallet',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      paymentMethods: ['gcash']
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: asset.visa,
      description: 'Pay with credit card',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      paymentMethods: ['card']
    },
    {
      id: 'paymaya',
      name: 'PayMaya',
      icon: asset.maya,
      description: 'Pay with PayMaya wallet',
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-700',
      paymentMethods: ['paymaya']
    }
  ];

  // Filter out already added payment methods
  useEffect(() => {
    if (open) {
      // Get existing payment methods when modal opens
      getPaymentMethods();
    }
  }, [open, getPaymentMethods]);

  useEffect(() => {
    if (availableMethods && availableMethods.length > 0) {
      // Use backend's availableMethods to filter frontend payment methods
      const filtered = allPaymentMethods.filter(method => {
        const methodType = method.paymentMethods[0]; // Get the backend payment method type
        return availableMethods.includes(methodType);
      });
      
      setAvailablePaymentMethods(filtered);
    } else if (availableMethods && availableMethods.length === 0) {
      // No available methods - all are already added
      setAvailablePaymentMethods([]);
    } else {
      // If no data yet, show all (initial state)
      setAvailablePaymentMethods(allPaymentMethods);
    }
  }, [availableMethods]);

  const handlePaymentMethodSelect = async (paymentMethodId) => {
    // Find the selected payment method configuration from available methods
    const selectedMethod = availablePaymentMethods.find(method => method.id === paymentMethodId);
    if (!selectedMethod) return;
    
    // Pass the array of payment methods and method ID to the store
    const result = await createPaymentLink(selectedMethod.paymentMethods, paymentMethodId);
    
    if (result.success && result.checkout_url) {
      // Automatically redirect to the payment URL
      window.open(result.checkout_url, '_blank');
      setOpen(false);
      if (onComplete) onComplete();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl flex flex-col">
        {/* Header */}
        <header className="flex flex-col sticky top-0">
          <div className="inline-flex items-center justify-between mb-4">
            <h1 className="font-semibold text-2xl">Select Payment Method</h1>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              <CircleX className="relative top-0 h-10 w-10 cursor-pointer" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Choose your preferred payment method to set up payment verification.
          </span>
        </header>

        <main>
          {availablePaymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Payment Methods Added</h3>
              <p className="text-gray-500">
                You have already set up all available payment methods. No additional payment methods can be added at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {availablePaymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPaymentMethod === method.id 
                    ? `${method.color} ${method.textColor} border-current` 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <img 
                      src={method.icon} 
                      alt={method.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {isLoading && selectedPaymentMethod === method.id && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm">ℹ</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Payment Verification</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You'll be redirected to complete a small verification payment (₱1.00) to activate your payment method. 
                  This ensures your account is properly set up for receiving donations.
                </p>
              </div>
            </div>
          </div>

          <div className="action flex justify-end items-center mt-6 space-x-2.5">
            <button
              onClick={() => setOpen(false)}
              className="btn text-gray-700 bg-gray-100 rounded-xl px-6 py-2"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentFields;
