import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    DollarSign, 
    Package, 
    Users, 
    TrendingUp, 
    CheckCircle, 
    Activity,
    RefreshCw,
    BarChart3,
    Calendar,
    UserCheck,
    FileText,
    Heart,
    ClipboardCheck,
    Filter,
    X
} from 'lucide-react';
import StatCard from '../../components/common/ui/StatCard';
import StatisticsCharts from '../../components/common/statistics/StatisticsCharts';
import { getDonationStats, getDashboardStats, getDonationList } from '../../services/common/donationTrackingService';
import { getComprehensiveStats } from '../../services/common/statisticsService';

const DirectorStatistics = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get filter values from URL search params (global state)
    const selectedMonth = searchParams.get('month') || 'all';
    const selectedYear = searchParams.get('year') || 'all';
    
    const [donationStats, setDonationStats] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [comprehensiveStats, setComprehensiveStats] = useState(null);
    const [donationList, setDonationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Check if any filter is active
    const hasActiveFilters = selectedMonth !== 'all' || selectedYear !== 'all';

    // Update URL search params (global filter update)
    const updateFilters = useCallback((month, year) => {
        const newParams = new URLSearchParams();
        if (month && month !== 'all') newParams.set('month', month);
        if (year && year !== 'all') newParams.set('year', year);
        setSearchParams(newParams, { replace: true });
    }, [setSearchParams]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    // Fetch all statistics
    const fetchStatistics = useCallback(async (month = 'all', year = 'all') => {
        try {
            setRefreshing(true);
            setLoading(true);
            setError(null);
            
            // Fetch all statistics in parallel with filters applied
            const [
                donationStatsResponse, 
                dashboardStatsResponse, 
                donationListResponse,
                comprehensiveStatsResponse
            ] = await Promise.all([
                getDonationStats({
                    month: month !== 'all' ? month : undefined,
                    year: year !== 'all' ? year : undefined
                }),
                getDashboardStats({
                    month: month !== 'all' ? month : undefined,
                    year: year !== 'all' ? year : undefined
                }),
                getDonationList({ 
                    page: 1, 
                    limit: 1000, 
                    dateRange: 'all',
                    month: month !== 'all' ? month : undefined,
                    year: year !== 'all' ? year : undefined
                }),
                getComprehensiveStats({
                    month: month !== 'all' ? month : undefined,
                    year: year !== 'all' ? year : undefined
                })
            ]);

            if (donationStatsResponse.success) {
                setDonationStats(donationStatsResponse.data);
            } else {
                console.error('❌ Donation Stats failed:', donationStatsResponse);
                setError('Failed to load donation statistics');
            }

            if (dashboardStatsResponse.success) {
                setDashboardStats(dashboardStatsResponse.data);
            } else {
                console.error('❌ Dashboard Stats failed:', dashboardStatsResponse);
            }

            if (comprehensiveStatsResponse.success) {
                setComprehensiveStats(comprehensiveStatsResponse.data);
            }

            if (donationListResponse.success && donationListResponse.data) {
                // Handle both array and object with data property
                const donations = Array.isArray(donationListResponse.data) 
                    ? donationListResponse.data 
                    : (donationListResponse.data.data || donationListResponse.data.donations || []);
                setDonationList(donations);
            } else {
                console.error('❌ Donation List failed:', donationListResponse);
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error('❌ Failed to fetch statistics:', error);
            setError('Failed to load statistics. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Fetch statistics whenever URL params change (global filter change)
    useEffect(() => {
        const currentMonth = searchParams.get('month') || 'all';
        const currentYear = searchParams.get('year') || 'all';
        
        fetchStatistics(currentMonth, currentYear);
    }, [searchParams, fetchStatistics]);

    // Handle manual refresh
    const handleRefresh = () => {
        fetchStatistics(selectedMonth, selectedYear);
    };

    // Generate month options
    const monthOptions = [
        { value: 'all', label: 'All Months' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Generate year options (current year and past 10 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [
        { value: 'all', label: 'All Years' },
        ...Array.from({ length: 11 }, (_, i) => ({
            value: String(currentYear - i),
            label: String(currentYear - i)
        }))
    ];

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
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

    // Get filter display text
    const getFilterDisplayText = () => {
        const filters = [];
        if (selectedMonth !== 'all') {
            const month = monthOptions.find(m => m.value === selectedMonth);
            filters.push(month?.label || 'Selected Month');
        }
        if (selectedYear !== 'all') {
            filters.push(selectedYear);
        }
        return filters.length > 0 ? filters.join(' • ') : 'All Data';
    };

    if (loading && !donationStats) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg text-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading statistics...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section with Filters */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                            <p className="text-gray-600">Welcome to UCLM CARES Statistics.</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Filters:</span>
                                {hasActiveFilters && (
                                    <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {getFilterDisplayText()}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                                {/* Month Filter */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">Month:</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => updateFilters(e.target.value, selectedYear)}
                                        className="px-3 py-2 rounded-md text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {monthOptions.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year Filter */}
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">Year:</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => updateFilters(selectedMonth, e.target.value)}
                                        className="px-3 py-2 rounded-md text-sm border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {yearOptions.map((year) => (
                                            <option key={year.value} value={year.value}>
                                                {year.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Clear</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                </div>

                {/* Section 1: Overview Statistics Cards (Large Cards - 4 in a row) */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Donations"
                            value={formatNumber(donationStats?.totalDonations || 0)}
                            icon={BarChart3}
                            color="bg-purple-500"
                            subtitle={hasActiveFilters ? getFilterDisplayText() : "All time donations"}
                        />
                        <StatCard
                            title="Total Amount"
                            value={formatCurrency(donationStats?.totalAmount || 0)}
                            icon={DollarSign}
                            color="bg-orange-500"
                            subtitle={hasActiveFilters ? getFilterDisplayText() : "Total funds collected"}
                        />
                        <StatCard
                            title="Total Goods Donated"
                            value={formatNumber(dashboardStats?.totalGoods || 0)}
                            icon={Package}
                            color="bg-teal-500"
                            subtitle={hasActiveFilters ? getFilterDisplayText() : "All time goods donations"}
                        />
                        <StatCard
                            title="Active Donors"
                            value={formatNumber(donationStats?.activeDonors || 0)}
                            icon={Users}
                            color="bg-red-500"
                            subtitle={hasActiveFilters ? getFilterDisplayText() : "All time"}
                        />
                    </div>
                </div>

                {/* Section 2: Trend Overview with Smaller Metric Cards */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Donation trends and metrics overview
                        </h2>

                        {/* Smaller Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Total Money Donated</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(dashboardStats?.totalMoney || 0)}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Total Goods</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(dashboardStats?.totalGoods || 0)}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Average Donation</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(donationStats?.averageDonation || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Additional System Statistics */}
                        {comprehensiveStats && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Events</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.events?.total || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {comprehensiveStats.events?.upcoming || 0} Upcoming, {comprehensiveStats.events?.ongoing || 0} Ongoing
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.users?.total || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {comprehensiveStats.users?.active || 0} Active ({comprehensiveStats.users?.activationRate?.toFixed(1) || 0}%)
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Volunteers</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.volunteers?.total || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatNumber(comprehensiveStats.volunteers?.registrations || 0)} Registrations
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Attendance</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.attendance?.total || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatNumber(comprehensiveStats.attendance?.recent || 0)} Recent (30d)
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Beneficiaries</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.beneficiaries?.total || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Form Link</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.forms?.total || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatNumber(comprehensiveStats.forms?.responses || 0)} Responses
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.documents?.total || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Total Destributed Certificate</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatNumber(comprehensiveStats.distributed?.total || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600 mb-1">Event Completion</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {comprehensiveStats.events?.completionRate?.toFixed(1) || 0}%
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {comprehensiveStats.events?.completed || 0} Completed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Last Updated */}
                        {lastUpdated && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Last updated: {lastUpdated.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Detailed Charts Section */}
                <div className="mb-6">
                    <StatisticsCharts 
                        donationStats={donationStats}
                        dashboardStats={dashboardStats}
                        donationList={donationList}
                    />
                </div>
            </div>
        </div>
    );
};

export default DirectorStatistics;
