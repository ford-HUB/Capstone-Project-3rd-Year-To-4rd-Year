import React from 'react';
import { Package, User, Mail, Clock, DollarSign, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

const DonationViewDetailsModal = ({ 
    isOpen, 
    onClose, 
    donation
}) => {
    if (!isOpen || !donation) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatEmail = (email, isAnonymous) => {
        if (!email) return 'N/A';
        
        // If donation is marked as anonymous, mask the email
        if (isAnonymous) {
            if (email.length <= 4) return email;
            return email.substring(0, 4) + '#'.repeat(4);
        }
        
        // If donation is not anonymous, show full email
        return email;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            case 'RECEIVED': return 'text-blue-600 bg-blue-100';
            case 'DISTRIBUTED': return 'text-purple-600 bg-purple-100';
            case 'COMPLETED': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Donation Details
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Complete information about this donation
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <div className="space-y-6">
                        {/* Donation Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-gray-500" />
                                <span className="font-medium text-gray-700">Status</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                                {donation.status}
                            </span>
                        </div>

                        {/* Donor Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                Donor Information
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Name:</span> {donation.is_anonymous ? 'Anonymous' : (donation.Account?.Donor?.fullname || 'Anonymous')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {formatEmail(donation.Account?.email, donation.is_anonymous)}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Donation Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <Package className="w-4 h-4 mr-2 text-orange-500" />
                                Donation Details
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Type:</span> {donation.donation_type}
                                    </span>
                                </div>
                                
                                {donation.donation_type === 'MONEY' ? (
                                    <div className="flex items-center space-x-3">
                                        <DollarSign className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-600">
                                            <span className="font-medium">Amount:</span> {formatCurrency(donation.Payments?.[0]?.amount)}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-600">
                                                <span className="font-medium">Goods Type:</span> {donation.GoodsDonation?.type_goods?.join(', ') || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-600">
                                                <span className="font-medium">Quantity:</span> {donation.GoodsDonation?.quantity || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-gray-600">
                                                <span className="font-medium">Condition:</span> {donation.GoodsDonation?.condition || 'N/A'}
                                            </span>
                                        </div>
                                        {donation.GoodsDonation?.detailed_description && (
                                            <div className="mt-2">
                                                <span className="text-sm text-gray-600">
                                                    <span className="font-medium">Description:</span>
                                                </span>
                                                <p className="text-sm text-gray-600 mt-1 pl-4">
                                                    {donation.GoodsDonation.detailed_description}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                Timeline
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Created:</span> {dayjs(donation.createdAt).format('MMM DD, YYYY h:mm A')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium">Last Updated:</span> {dayjs(donation.updatedAt).format('MMM DD, YYYY h:mm A')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationViewDetailsModal;
