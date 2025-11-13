import React from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';

const BeneficiaryRegistrationCancelModal = ({ 
  open, 
  setOpen, 
  selectedRegistration, 
  onConfirm 
}) => {
  if (!open || !selectedRegistration) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Cancel Registration</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure you want to cancel?
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Event:</span> {selectedRegistration.event?.title}
              </p>
              <p className="text-sm text-gray-500">
                You will lose your spot and need to re-register if you change your mind.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setOpen(false)}
            className="px-6 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Keep Registration
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryRegistrationCancelModal;
