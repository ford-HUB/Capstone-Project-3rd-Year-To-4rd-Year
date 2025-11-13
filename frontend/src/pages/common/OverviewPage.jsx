import React, { useEffect, useState } from 'react';
import { 
    Users, 
    Calendar,
    UserCheck,
    Heart,
    FileText,
    ClipboardCheck,
    Activity,
    RefreshCw,
    TrendingUp,
    Award,
    Target,
    BarChart3,
    FileCheck,
    BadgeCheck,
    Package
} from 'lucide-react';
import StatCard from '../../components/common/ui/StatCard';
import RealtimeTransactions from '../../components/common/statistics/RealtimeTransactions';
import { getOverviewStats } from '../../services/common/statisticsService';

const OverviewPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    // Fetch overview statistics
    const fetchStatistics = async () => {
        try {
            setRefreshing(true);
            setError(null);
            
            const response = await getOverviewStats();
            
            if (response.success) {
                setStats(response.data);
                setLastUpdated(new Date());
            } else {
                setError(response.message || 'Failed to fetch overview statistics');
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            setError('Failed to load overview statistics. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    // Handle manual refresh
    const handleRefresh = () => {
        fetchStatistics();
    };

    // Format number with thousand separators
    const formatNumber = (number) => {
        const num = parseFloat(number) || 0;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };

    // Format percentage
    const formatPercentage = (value, total) => {
        if (!total || total === 0) return '0%';
        return `${((value / total) * 100).toFixed(1)}%`;
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg text-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading overview...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">System Overview</h1>
                            <p className="text-gray-600">Comprehensive view of UCLM CARES System statistics and activities</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm border border-gray-200">
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Main Statistics Cards */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={formatNumber(stats?.users?.total || 0)}
                            icon={Users}
                            color="bg-blue-500"
                            subtitle={`${formatNumber(stats?.users?.active || 0)} active (${stats?.users?.activationRate?.toFixed(1) || 0}%)`}
                        />
                        <StatCard
                            title="Total Events"
                            value={formatNumber(stats?.events?.total || 0)}
                            icon={Calendar}
                            color="bg-purple-500"
                            subtitle={`${formatNumber(stats?.events?.upcoming || 0)} upcoming, ${formatNumber(stats?.events?.ongoing || 0)} ongoing`}
                        />
                        <StatCard
                            title="Total Volunteers"
                            value={formatNumber(stats?.volunteers?.total || 0)}
                            icon={UserCheck}
                            color="bg-green-500"
                            subtitle={`${formatNumber(stats?.volunteers?.registrations || 0)} registrations`}
                        />
                        <StatCard
                            title="Total Beneficiaries"
                            value={formatNumber(stats?.beneficiaries?.total || 0)}
                            icon={Heart}
                            color="bg-red-500"
                            subtitle="Beneficiaries served"
                        />
                    </div>
                </div>

                {/* Secondary Statistics Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                System Metrics
                            </h2>
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm text-gray-600">Total Attendance</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(stats?.attendance?.total || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatNumber(stats?.attendance?.recent || 0)} recent (30d)
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Award className="w-5 h-5 text-purple-600" />
                                    <p className="text-sm text-gray-600">Event Completion</p>
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats?.events?.completionRate?.toFixed(1) || 0}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatNumber(stats?.events?.completed || 0)} completed events
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <p className="text-sm text-gray-600">Total Form Links</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(stats?.forms?.total || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Total form links
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <FileCheck className="w-5 h-5 text-teal-600" />
                                    <p className="text-sm text-gray-600">Total Document</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(stats?.documents?.total || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Total documents in system
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <BadgeCheck className="w-5 h-5 text-indigo-600" />
                                    <p className="text-sm text-gray-600">Total Certificate Distributed</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(stats?.distributed?.total || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Certificates distributed
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Package className="w-5 h-5 text-teal-600" />
                                    <p className="text-sm text-gray-600">Total Goods Donated</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(stats?.donations?.totalGoods || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Goods donations received
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Activity (Last 30 Days)
                            </h2>
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Recent Events</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatNumber(stats?.events?.recent || 0)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                <p className="text-sm text-gray-600 mb-1">Recent Registrations</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {formatNumber(stats?.volunteers?.recentRegistrations || 0)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                <p className="text-sm text-gray-600 mb-1">Recent Donations</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {formatNumber(stats?.donations?.recent || 0)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                <p className="text-sm text-gray-600 mb-1">Recent Attendance</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {formatNumber(stats?.attendance?.recent || 0)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                                <p className="text-sm text-gray-600 mb-1">Total Goods Donated</p>
                                <p className="text-2xl font-bold text-teal-900">
                                    {formatNumber(stats?.donations?.totalGoods || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-Time Transactions Section */}
                <div className="mb-6">
                    <RealtimeTransactions />
                </div>

                {/* Summary Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">System Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">User Engagement</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                The system currently has <strong>{formatNumber(stats?.users?.total || 0)}</strong> registered users, 
                                with <strong>{formatNumber(stats?.users?.active || 0)}</strong> active accounts 
                                ({stats?.users?.activationRate?.toFixed(1) || 0}% activation rate).
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Event Management</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                There are <strong>{formatNumber(stats?.events?.total || 0)}</strong> events in the system, 
                                with <strong>{formatNumber(stats?.events?.upcoming || 0)}</strong> upcoming and 
                                <strong> {formatNumber(stats?.events?.ongoing || 0)}</strong> currently ongoing.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-gray-900">Volunteer Participation</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                <strong>{formatNumber(stats?.volunteers?.total || 0)}</strong> volunteers are registered, 
                                with <strong>{formatNumber(stats?.volunteers?.registrations || 0)}</strong> event registrations 
                                and <strong>{formatNumber(stats?.attendance?.total || 0)}</strong> attendance records.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                {lastUpdated && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Last updated: {lastUpdated.toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewPage;

