import React from 'react';
import { DollarSign, Users, Package, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const InternalDonationStats = ({ stats }) => {
    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 animate-pulse rounded-lg p-4 h-24"></div>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: Package,
            color: 'bg-blue-500',
            iconColor: 'text-blue-200'
        },
        {
            title: 'Total Amount',
            value: `₱${(stats.totalAmount || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-500',
            iconColor: 'text-green-200'
        },
        {
            title: 'Active Donors',
            value: stats.activeDonors || 0,
            icon: Users,
            color: 'bg-purple-500',
            iconColor: 'text-purple-200'
        },
        {
            title: 'Completed',
            value: stats.completedDonations || 0,
            icon: CheckCircle,
            color: 'bg-orange-500',
            iconColor: 'text-orange-200'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className={`${stat.color} p-6 rounded-lg shadow-md text-white`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${stat.iconColor} mb-1`}>
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stat.value}
                                </h3>
                            </div>
                            <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InternalDonationStats;
