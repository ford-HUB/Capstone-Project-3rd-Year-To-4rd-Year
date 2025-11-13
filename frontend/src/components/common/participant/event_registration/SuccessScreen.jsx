import React from 'react';
import { Check } from 'lucide-react';

const SuccessScreen = ({ onClose }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">You'll receive a confirmation email shortly.</p>
            
            <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Close
            </button>
        </div>
    );
};

export default SuccessScreen;