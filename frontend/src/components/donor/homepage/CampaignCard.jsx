import React from 'react';
import { Clock, Users } from 'lucide-react';
import { getCategoryStyle, getStatusBadgeClasses } from '../../../utils/categoryUtils';

const CampaignCard = ({
    campaign,
    onTrackClick,
    onDonateClick,
    isTracking,
    hasDonated = false,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group max-w-xs mx-auto">
            <div className="relative w-full h-40 overflow-hidden">
                {campaign.image ? (
                    <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className={`w-full h-full bg-gradient-to-br ${campaign.gradient} flex items-center justify-center text-4xl relative ${
                        campaign.image ? 'hidden' : 'flex'
                    }`}
                    style={{ display: campaign.image ? 'none' : 'flex' }}>
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10">{campaign.icon}</div>
                </div>
                {/* Category Badge Overlay */}
                <div className="absolute top-2 left-2">
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                            campaign.category
                        )} backdrop-blur-sm bg-white/80`}>
                        {campaign.category}
                    </span>
                </div>

                {/* Donation Types Badge */}
                {campaign.donationTypes && campaign.donationTypes.length > 0 && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 backdrop-blur-sm">
                            {campaign.donationTypes.join(' & ')}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center justify-end mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Ends {campaign.endDate}</span>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
                    {campaign.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                    {campaign.description}
                </p>

                {/* Event Details */}
                <div className="mb-3 space-y-1">
                    {campaign.organizer && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Organizer:</span>
                            <span>{campaign.organizer}</span>
                        </div>
                    )}
                    {campaign.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Location:</span>
                            <span>{campaign.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(campaign.status)}`}>
                            {campaign.status}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">
                            Total Raised
                        </span>
                        <span className="text-xs font-bold text-purple-600">
                            ₱{campaign.raised.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(campaign.progress, 100)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-500">
                            <span>Total: {campaign.totalDonations}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{campaign.donors}</span>
                        </div>
                    </div>

                    {/* Goods Donation Count */}
                    {campaign.goodsDonationCount > 0 && (
                        <div className="mt-2 text-center p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="text-xs font-bold text-emerald-700">
                                {campaign.goodsDonationCount}
                            </div>
                            <div className="text-xs text-emerald-600 font-medium">
                                Goods Donations
                            </div>
                        </div>
                    )}

                    {campaign.averageDonation > 0 && (
                        <div className="mt-1 text-xs text-gray-500 text-center">
                            <span>Avg: ₱{campaign.averageDonation.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {hasDonated && (
                        <button
                            onClick={() => onTrackClick(campaign.id)}
                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                                isTracking
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                            }`}>
                            {isTracking ? 'Tracking' : 'Track'}
                        </button>
                    )}
                    <button
                        onClick={() => onDonateClick(campaign.id)}
                        className={`${hasDonated ? 'flex-1' : 'w-full'} py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105`}>
                        Donate Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;

