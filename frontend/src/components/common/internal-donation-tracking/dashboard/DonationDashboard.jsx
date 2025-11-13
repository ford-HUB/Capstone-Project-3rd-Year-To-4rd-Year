import React from 'react';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';

const DonationDashboard = ({ 
    stats = null,
    selectedEvent,
    onEventChange,
    eventOptions,
    loading = false 
}) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number || 0);
    };

    // Use stats from API, with fallback to zeros if not loaded yet
    const dashboardStatsData = stats || {
        totalMoney: 0,
        totalGoods: 0,
        totalDonors: 0,
        averagePerDonor: 0
    };

    // Calculate average per donor if not provided
    const averagePerDonor = dashboardStatsData.averagePerDonor || 
        (dashboardStatsData.totalDonors > 0 
            ? dashboardStatsData.totalMoney / dashboardStatsData.totalDonors 
            : 0);

    const dashboardStats = [
        {
            title: 'Total Money Donated',
            value: formatCurrency(dashboardStatsData.totalMoney),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100'
        },
        {
            title: 'Goods Received',
            value: formatNumber(dashboardStatsData.totalGoods),
            icon: Package,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            title: 'Total Donors',
            value: formatNumber(dashboardStatsData.totalDonors),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        },
        {
            title: 'Average per Donor',
            value: formatCurrency(averagePerDonor),
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100'
        }
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Donation Dashboard</h2>
                        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-20 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Donation Dashboard</h2>
                    
                    {/* Event Filter */}
                    <div className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-gray-700">
                            Filter by Event:
                        </label>
                        <select
                            value={selectedEvent}
                            onChange={(e) => onEventChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="all">All Active Events</option>
                            {eventOptions.map((event) => (
                                <option key={event.value} value={event.value}>
                                    {event.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`${stat.bgColor} rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className={`text-2xl font-bold ${stat.color}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                        <div className={`${stat.iconBg} rounded-full p-3`}>
                                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Text */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        {selectedEvent === 'all' 
                            ? 'Showing statistics for all active events (excluding completed events)'
                            : `Showing statistics for: ${eventOptions.find(e => e.value === selectedEvent)?.label || selectedEvent}`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationDashboard;
