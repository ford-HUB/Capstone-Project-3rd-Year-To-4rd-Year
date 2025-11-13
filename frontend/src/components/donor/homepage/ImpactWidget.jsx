import React from 'react';
import { Package } from 'lucide-react';

const ImpactWidget = ({ stats }) => {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Your Impact</h3>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Active Donor
                </span>
            </div>

            <div className="text-center py-4">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                    Making a Difference
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    Your generous contributions are creating positive change in
                    the community. Every donation, whether monetary or in-kind,
                    helps support meaningful causes and makes a lasting impact on
                    the lives of those in need.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="space-y-4">
                {/* Total Funds Donated */}
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 text-lg">💰</span>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500">
                                    Total Funds Donated
                                </div>
                                <div className="text-xl font-bold text-purple-600">
                                    ₱{(stats?.totalMoneyDonated || 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Your monetary contributions help fund essential programs,
                        provide resources, and support various community initiatives.
                    </p>
                </div>

                {/* Total Goods Donated */}
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500">
                                    Total Goods Donated
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                    {(stats?.totalGoodsDonations || 0).toLocaleString()}{' '}
                                    {stats?.totalGoodsDonations === 1 ? 'item' : 'items'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Your in-kind donations provide essential goods and materials
                        that directly benefit recipients and support the success of
                        various campaigns.
                    </p>
                </div>

                {/* Additional Stats */}
                {stats &&
                    (stats.totalDonations > 0 || stats.campaignsSupported > 0) && (
                        <div className="bg-white rounded-xl p-4 border border-purple-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {stats.totalDonations || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Total Donations
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {stats.campaignsSupported || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Campaigns Supported
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ImpactWidget;

