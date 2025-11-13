import React from 'react';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentStatusModal = ({ status, onClose }) => {
  const isSuccess = status === 'success';
  const isCancelled = status === 'cancelled';

  if (!isSuccess && !isCancelled) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h2 className={`text-2xl font-semibold mb-2 ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {isSuccess ? 'Payment Successful!' : 'Payment Cancelled'}
          </h2>
          
          <p className={`text-sm ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {isSuccess 
              ? 'Your payment method has been successfully configured and verified.'
              : 'Payment setup was cancelled. You can try again anytime.'
            }
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Payment Method Active</h4>
                  <p className="text-sm text-green-700">
                    You can now receive donations through your configured payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Setup Incomplete</h4>
                  <p className="text-sm text-yellow-700">
                    You can set up your payment method anytime from your profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <Link
            to="/director/profile"
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
          >
            {isSuccess ? 'View Profile' : 'Set Up Payment'}
          </Link>
          
          <Link
            to="/director/dashboard"
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusModal;
