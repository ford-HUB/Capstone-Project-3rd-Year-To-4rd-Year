import React from 'react';
import { DollarSign, TrendingUp, Users, CheckCircle } from 'lucide-react';

const DonationStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Donations',
            value: `₱${stats?.totalAmount?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: stats?.totalChange || 0,
            changeType: 'positive'
        },
        {
            title: 'Active Donors',
            value: stats?.activeDonors || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: stats?.donorChange || 0,
            changeType: 'positive'
        },
        {
            title: 'Completed Donations',
            value: stats?.completedDonations || 0,
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: stats?.completionChange || 0,
            changeType: 'positive'
        },
        {
            title: 'Average Donation',
            value: `₱${stats?.averageDonation?.toLocaleString() || '0'}`,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: stats?.averageChange || 0,
            changeType: 'neutral'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                        {stat.change !== 0 && (
                            <div className="mt-4 flex items-center">
                                <span className={`text-sm font-medium ${
                                    stat.changeType === 'positive' ? 'text-green-600' : 
                                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                    from last month
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DonationStats;
