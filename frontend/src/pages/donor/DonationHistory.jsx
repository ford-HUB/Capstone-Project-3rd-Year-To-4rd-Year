import React, { useState, useEffect, useMemo } from 'react';
import { 
    Calendar, 
    TrendingUp, 
    TrendingDown,
    BarChart3,
    PieChart,
    Clock,
    Search,
    Filter,
    CheckCircle,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Award,
    Target,
    Heart,
    Users,
    Globe,
    Star,
    ArrowUp,
    ArrowDown,
    Minus,
    Package
} from 'lucide-react';
import { asset } from '../../assets/asset.jsx';
import { useDonationHistoryStore } from '../../store/donor/useDonationHistoryStore.js';

const DonationHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    // Use donation history store
    const { donationHistory, loading, error, fetchDonationHistory } = useDonationHistoryStore();

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        campaign_type: '',
        month: '',
        search_term: ''
    });

    // Fetch donation history on component mount
    useEffect(() => {
        const init = async () => {
            await fetchDonationHistory();
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get available years from donation history
    const yearOptions = useMemo(() => {
        const years = new Set();
        donationHistory.forEach(donation => {
            if (donation.year) {
                years.add(donation.year.toString());
            }
        });
        const sortedYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
        return sortedYears.length > 0 ? sortedYears : [new Date().getFullYear().toString()];
    }, [donationHistory]);

    // Update selected year if current selection is not in options
    useEffect(() => {
        if (!yearOptions.includes(selectedYear) && yearOptions.length > 0) {
            setSelectedYear(yearOptions[0]);
        }
    }, [yearOptions, selectedYear]);

    const statusOptions = [
        { value: 'received', label: 'Received' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' }
    ];

    const campaignTypeOptions = [
        { value: 'Community', label: 'Community' },
        { value: 'Health', label: 'Health' },
        { value: 'Education', label: 'Education' },
        { value: 'Emergency', label: 'Emergency' }
    ];

    const monthOptions = [
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' }
    ];


    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'Visa':
                return <img src={asset.visa} alt="Visa" className="w-4 h-3 object-contain" />;
            case 'Mastercard':
                return <img src={asset.mastercard} alt="Mastercard" className="w-4 h-3 object-contain" />;
            case 'GCash':
                return <img src={asset.gcash} alt="GCash" className="w-4 h-3 object-contain" />;
            case 'PayMaya':
                return <img src={asset.maya} alt="PayMaya" className="w-4 h-3 object-contain" />;
            default:
                return <Heart className="w-4 h-3 text-gray-600" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'received':
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'received':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Education':
                return 'bg-blue-100 text-blue-800';
            case 'Healthcare':
                return 'bg-green-100 text-green-800';
            case 'Disaster Relief':
                return 'bg-red-100 text-red-800';
            case 'Community':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter and search functionality
    const filteredDonations = useMemo(() => {
        const list = Array.isArray(donationHistory) ? donationHistory : [];
        const term = (filters.search_term || '').toLowerCase();
        
        return list.filter((donation) => {
            const matchesSearch = !term ||
                donation.campaign?.toLowerCase().includes(term) ||
                donation.id?.toString().toLowerCase().includes(term) ||
                donation.transactionId?.toString().toLowerCase().includes(term);
            
            const matchesStatus = !filters.status || donation.status === filters.status;
            const matchesType = !filters.campaign_type || donation.campaignType === filters.campaign_type;
            const matchesMonth = !filters.month || donation.month === filters.month;
            const matchesYear = !selectedYear || donation.year?.toString() === selectedYear;
            
            return matchesSearch && matchesStatus && matchesType && matchesMonth && matchesYear;
        });
    }, [donationHistory, filters, selectedYear]);

    // Calculate statistics
    const totalAmount = useMemo(() => {
        return filteredDonations.reduce((sum, donation) => {
            return sum + (donation.donationType === 'money' ? (donation.amount || 0) : 0);
        }, 0);
    }, [filteredDonations]);
    
    const totalRecords = filteredDonations.length;
    
    // Pagination derived values
    useEffect(() => {
        const pages = Math.max(1, Math.ceil(totalRecords / limitPerPage));
        setTotalPages(pages);
        if (currentPage > pages) setCurrentPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalRecords, limitPerPage]);

    const pagedDonations = useMemo(() => {
        const start = (currentPage - 1) * limitPerPage;
        const end = start + limitPerPage;
        return filteredDonations.slice(start, end);
    }, [filteredDonations, currentPage, limitPerPage]);

    // Calculate year-over-year comparison
    const currentYearTotal = useMemo(() => {
        const currentYearDonations = filteredDonations.filter(d => d.year?.toString() === selectedYear);
        return currentYearDonations.reduce((sum, d) => sum + (d.donationType === 'money' ? (d.amount || 0) : 0), 0);
    }, [filteredDonations, selectedYear]);
    
    const previousYearTotal = useMemo(() => {
        const prevYear = (parseInt(selectedYear) - 1).toString();
        const previousYearDonations = donationHistory.filter(d => d.year?.toString() === prevYear);
        return previousYearDonations.reduce((sum, d) => sum + (d.donationType === 'money' ? (d.amount || 0) : 0), 0);
    }, [donationHistory, selectedYear]);
    
    const yearOverYearChange = previousYearTotal > 0 
        ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100 
        : 0;

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            const newFilters = { ...filters, search_term: value };
            setFilters(newFilters);
            setCurrentPage(1);
        }, 500);

        setSearchTimeout(timeout);
    };

    const clearFilters = () => {
        const clearedFilters = {
            status: '',
            campaign_type: '',
            month: '',
            search_term: ''
        };
        setFilters(clearedFilters);
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    const getTrendIcon = (change) => {
        if (change > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
        if (change < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
        return <Minus className="w-4 h-4 text-gray-600" />;
    };

    const getTrendColor = (change) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Track your donation history and analyze your giving patterns
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {Object.values(filters).filter(v => v !== '').length}
                            </span>
                        )}
                    </button>
                </div>
            </div>


            {/* Filters */}
            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by campaign, ID, or transaction..."
                                    value={filters.search_term}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Status</option>
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Campaign Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                            <select
                                value={filters.campaign_type}
                                onChange={(e) => handleFilterChange('campaign_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Types</option>
                                {campaignTypeOptions.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select
                                value={filters.month}
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Months</option>
                                {monthOptions.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="overflow-x-auto">
                    {error && (
                        <div className="mb-3 text-sm text-red-600">{error}</div>
                    )}
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Campaign
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Impact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {pagedDonations.map((donation) => (
                                <tr key={donation.id} className="hover:bg-gray-50">
                                    {/* Campaign */}
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{donation.campaign}</div>
                                            <div className="text-xs text-gray-500">{donation.description}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(donation.category)}`}>
                                                    {donation.category}
                                                </span>
                                                <span className="text-xs text-gray-500">{donation.campaignType}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td className="py-4 px-6">
                                        {donation.donationType === 'money' ? (
                                            <div className="flex items-center">
                                                <div className="w-6 h-4 bg-white border border-gray-200 rounded flex items-center justify-center p-1 mr-2">
                                                    {getPaymentMethodIcon(donation.paymentMethod)}
                                                </div>
                                                <span className="text-sm text-gray-900">{donation.paymentMethod}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <div className="w-6 h-4 bg-blue-100 border border-blue-200 rounded flex items-center justify-center p-1 mr-2">
                                                    <Heart className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <span className="text-sm text-gray-900">In-Kind</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* Impact */}
                                    <td className="py-4 px-6">
                                        {donation.donationType === 'money' ? (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <Heart className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold text-purple-600">
                                                            {donation.impact || `₱${(donation.amount || 0).toLocaleString()} contributed`}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Monetary support</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold text-blue-600">
                                                            {donation.impact || donation.goodsTypes || 'Goods Donation'}
                                                        </div>
                                                        {donation.goodsQuantity > 0 && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {donation.goodsQuantity.toLocaleString()} {donation.goodsQuantity === 1 ? 'item' : 'items'}
                                                            </div>
                                                        )}
                                                        {donation.goodsValue > 0 && (
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                Est. Value: ₱{donation.goodsValue.toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Total */}
                                    <td className="py-4 px-6">
                                        {donation.donationType === 'money' ? (
                                            <div className="text-sm font-bold text-gray-900">₱{(donation.amount || 0).toLocaleString()}</div>
                                        ) : (
                                            <div className="text-sm font-bold text-gray-900">{
                                                donation.goodsQuantity && donation.goodsQuantity > 0
                                                    ? `${donation.goodsQuantity.toLocaleString()} items`
                                                    : (donation.goodsQuantityText || '-')
                                            }</div>
                                        )}
                                    </td>

                                    {/* Details */}
                                    <td className="py-4 px-6">
                                        {donation.donationType === 'money' ? (
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">₱{(donation.amount || 0).toLocaleString()}</div>
                                                <div className="text-xs text-gray-500">{donation.id}</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{donation.goodsTypes || '-'}</div>
                                                <div className="text-xs text-gray-500">{donation.id}</div>
                                                <div className="text-xs text-blue-600 font-medium">In-Kind</div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-900">{new Date(donation.date).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">{donation.month} {donation.year}</div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                                {getStatusIcon(donation.status)}
                                                <span className="ml-1 capitalize">{donation.status}</span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Empty State */}
                    {pagedDonations.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No donation history found</h3>
                            <p className="text-gray-600">
                                {hasActiveFilters 
                                    ? "Try adjusting your filters to see more results." 
                                    : "You haven't made any donations yet."
                                }
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && filteredDonations.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * limitPerPage) + 1} to {Math.min(currentPage * limitPerPage, totalRecords)} of {totalRecords} records
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationHistory;