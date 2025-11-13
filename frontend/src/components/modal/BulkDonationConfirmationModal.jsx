import React from 'react';
import { CheckCircle, Package, User, Mail, AlertTriangle, X } from 'lucide-react';

const BulkDonationConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    selectedDonations = [], 
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Confirm Donation Receipt
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Mark {selectedDonations.length} donation{selectedDonations.length !== 1 ? 's' : ''} as received
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
                    {/* Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-900">Bulk Action Confirmation</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    You are about to mark {selectedDonations.length} donation{selectedDonations.length !== 1 ? 's' : ''} as "RECEIVED". 
                                    This action will send email notifications to all donors and cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Donations List */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-orange-500" />
                            Selected Donations ({selectedDonations.length})
                        </h4>
                        
                        <div className="space-y-3">
                            {selectedDonations.map((donation, index) => (
                                <div key={donation.donation_id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Donor Information */}
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <User className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm text-gray-600">
                                                        <span className="font-medium">Donor:</span> {donation.is_anonymous ? 'Anonymous' : (donation.Account?.Donor?.fullname || 'Anonymous')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="w-4 h-4 text-purple-500" />
                                                    <span className="text-sm text-gray-600">
                                                        <span className="font-medium">Email:</span> {formatEmail(donation.Account?.email, donation.is_anonymous)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Event Information */}
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className="text-sm text-gray-600">
                                                    <span className="font-medium">Event:</span> {donation.Event?.title || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Donation Details */}
                                            <div className="bg-white rounded-md p-3 border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Package className="w-4 h-4 text-orange-500" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {donation.donation_type === 'MONEY' ? 'Money Donation' : 'Goods Donation'}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        {donation.donation_type === 'MONEY' ? (
                                                            <span className="text-sm font-medium text-green-600">
                                                                {formatCurrency(donation.Payments?.[0]?.amount)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-gray-600">
                                                                {donation.GoodsDonation?.type_goods?.join(', ') || 'Various goods'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {donation.donation_type === 'GOODS' && donation.GoodsDonation?.detailed_description && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        {donation.GoodsDonation.detailed_description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Confirm Receipt</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkDonationConfirmationModal;
