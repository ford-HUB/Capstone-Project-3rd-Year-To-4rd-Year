import React from 'react';
import { DollarSign, TrendingUp, Users, CheckCircle } from 'lucide-react';

const EventDonationsStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Donations',
            value: `₱${stats?.totalAmount?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Total Donors',
            value: stats?.totalDonors || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Completed',
            value: stats?.completedDonations || 0,
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Average',
            value: `₱${stats?.averageDonation?.toLocaleString() || '0'}`,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
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
                    </div>
                );
            })}
        </div>
    );
};

export default EventDonationsStats;
