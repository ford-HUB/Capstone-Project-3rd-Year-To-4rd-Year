import React from 'react';
import { X, Package } from 'lucide-react';
import DonationProgressSteps, { getCurrentStatusLabel } from '../my-donations/ui/DonationProgressSteps';
import { getCategoryStyle } from '../../../utils/categoryUtils';

const CampaignTrackingModal = ({
    campaign,
    donations,
    onClose,
    onDonateClick,
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            }}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">
                            Donation Tracking
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close tracking">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto scrollable p-6 flex-1">
                    {/* Campaign Info */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <h4 className="text-base font-bold text-gray-900 mb-2">
                            {campaign.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                            {campaign.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                                    campaign.category
                                )}`}>
                                {campaign.category}
                            </span>
                            <span className="text-sm font-semibold text-purple-600">
                                ₱{campaign.raised.toLocaleString()} raised
                            </span>
                        </div>
                    </div>

                    {/* Donations List */}
                    {donations.length > 0 ? (
                        <div className="space-y-4">
                            <h5 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                Your Donations ({donations.length})
                            </h5>
                            {donations.map((donation, index) => (
                                <div
                                    key={donation.id || donation.donation_id || index}
                                    className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold text-gray-900 mb-1">
                                                {donation.donationType === 'money'
                                                    ? '💰 Money Donation'
                                                    : '📦 Goods Donation'}
                                            </div>
                                            {donation.donationType === 'money' &&
                                                donation.amount > 0 && (
                                                    <div className="text-sm font-bold text-purple-600">
                                                        ₱{parseFloat(
                                                            donation.amount
                                                        ).toLocaleString()}
                                                    </div>
                                                )}
                                            {donation.donationType === 'goods' &&
                                                donation.goodsQuantity > 0 && (
                                                    <div className="text-sm font-bold text-purple-600">
                                                        {donation.goodsQuantity.toLocaleString()}{' '}
                                                        items
                                                    </div>
                                                )}
                                            {donation.date && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        donation.date
                                                    ).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        {(() => {
                                            const currentStatus = getCurrentStatusLabel(
                                                donation.status || 'pending',
                                                donation.eventStatus || campaign.status || ''
                                            );
                                            
                                            // Determine badge color based on current status
                                            let badgeColor = 'bg-gray-100 text-gray-700';
                                            if (currentStatus === 'Complete') {
                                                badgeColor = 'bg-green-100 text-green-700';
                                            } else if (currentStatus === 'Distribution') {
                                                badgeColor = 'bg-yellow-100 text-yellow-700';
                                            } else if (currentStatus === 'Received') {
                                                badgeColor = 'bg-blue-100 text-blue-700';
                                            }
                                            
                                            return (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                                                    {currentStatus}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <div className="mt-2">
                                        <DonationProgressSteps
                                            status={donation.status || 'pending'}
                                            eventStatus={
                                                donation.eventStatus ||
                                                campaign.status ||
                                                ''
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                No donations yet
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Make your first donation to track it here
                            </p>
                            <button
                                onClick={() => onDonateClick(campaign.id)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105">
                                Donate Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignTrackingModal;

