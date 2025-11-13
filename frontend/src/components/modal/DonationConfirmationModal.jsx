import React from 'react';
import { CheckCircle, Package, User, Mail, AlertTriangle } from 'lucide-react';

const DonationConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    donation, 
    loading = false 
}) => {
    if (!isOpen) return null;

    const formatEmail = (email, isAnonymous) => {
        if (!email) return 'N/A';
        
        if (isAnonymous) {
            if (email.length <= 4) return email;
            return email.substring(0, 4) + '#'.repeat(4);
        }
        
        return email;
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Donation Receipt
                            </h3>
                            <p className="text-sm text-gray-500">
                                Mark this donation as received
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="space-y-4">
                        {/* Donation Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Donation Details</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Type:</span> {donation?.donation_type}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Donor:</span> {donation?.is_anonymous ? 'Anonymous' : (donation?.Account?.Donor?.fullname || 'Anonymous')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {formatEmail(donation?.Account?.email, donation?.is_anonymous)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Event:</span> {donation?.Event?.title || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900">What happens next?</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        This will mark the donation as <strong>RECEIVED</strong> and send an email notification to the donor at <strong>{donation?.Donor?.email || 'their registered email'}</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Mark as Received</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationConfirmationModal;
