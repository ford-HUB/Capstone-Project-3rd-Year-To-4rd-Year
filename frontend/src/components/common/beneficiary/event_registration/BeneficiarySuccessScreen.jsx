import React from 'react';
import { CheckCircle, Mail, Calendar, Heart } from 'lucide-react';

const BeneficiarySuccessScreen = ({ onClose }) => {
    return (
        <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                    Registration Successful!
                </h2>
                <p className="text-gray-600">
                    You have successfully registered for the event. We're excited to have you join us!
                </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">What's Next?</span>
                </div>
                <ul className="text-sm text-green-700 space-y-2 text-left">
                    <li>• Check your email for confirmation details</li>
                    <li>• Save the event date and time in your calendar</li>
                    <li>• Contact the organizer if you have questions</li>
                    <li>• Arrive 15 minutes before the event starts</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Thank You!</span>
                </div>
                <p className="text-sm text-blue-700">
                    Your participation helps make our community events successful. 
                    We appreciate your commitment to community service.
                </p>
            </div>

            <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Close
            </button>
        </div>
    );
};

export default BeneficiarySuccessScreen;
