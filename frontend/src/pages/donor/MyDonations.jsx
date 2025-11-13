import React, { useEffect, useMemo, useState } from 'react';
import { 
    Heart,
    Search,
    Filter,
    CheckCircle,
    Clock,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Package,
    Calendar,
    DollarSign,
    Receipt
} from 'lucide-react';
import { asset } from '../../assets/asset.jsx';
import { getDonationPublicDetails } from '../../services/common/donationTrackingService.js';
import { useMyDonationsStore } from '../../store/donor/useMyDonationsStore.js';
import DonationProgressSteps from '../../components/donor/my-donations/ui/DonationProgressSteps.jsx';

const MyDonations = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [trackingDonationId, setTrackingDonationId] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState(null);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [donationDetails, setDonationDetails] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        campaign_type: '',
        year: '2024',
        search_term: ''
    });

    // Live donations from store (service -> store -> component)
    // Data is already formatted by the backend controller
    const { myDonations, loading: storeLoading, error: storeError, fetchMyDonations } = useMyDonationsStore();

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchMyDonations();
            setLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setError(storeError);
    }, [storeError]);

    const statusOptions = [
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' }
    ];

    const campaignTypeOptions = [
        { value: 'Community', label: 'Community' },
        { value: 'Health', label: 'Health' },
        { value: 'Education', label: 'Education' },
        { value: 'Emergency', label: 'Emergency' }
    ];

    const yearOptions = ['2024', '2023', '2022'];

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
        const list = Array.isArray(myDonations) ? myDonations : [];
        const term = (filters.search_term || '').toLowerCase();
        return list.filter((donation) => {
            const eventIsCompleted = (donation.eventStatus || '').toLowerCase() === 'completed';
            if (eventIsCompleted) return false;
            const inSearch = !term ||
                donation.campaign?.toLowerCase().includes(term) ||
                donation.id?.toString().toLowerCase().includes(term) ||
                donation.transactionId?.toString().toLowerCase().includes(term);

            const inStatus = !filters.status || donation.status === filters.status;
            const inType = !filters.campaign_type || donation.campaignType === filters.campaign_type;
            return inSearch && inStatus && inType;
        });
    }, [myDonations, filters]);

    // Pagination derived values
    const totalRecords = filteredDonations.length;
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

    // removed unused totals/metrics

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
            year: '2024',
            search_term: ''
        };
        setFilters(clearedFilters);
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== '2024');

    const handleView = async (donationId) => {
        // Toggle tracking - if already tracking this donation, close it
        if (trackingDonationId === donationId) {
            setTrackingDonationId(null);
            setDonationDetails(null);
            setSelectedDonation(null);
            return;
        }

        // Open tracking for this donation
        setTrackingDonationId(donationId);
        setTrackingLoading(true);
        setTrackingError(null);
        setDonationDetails(null);
        const base = myDonations.find(d => d.id === donationId) || null;
        setSelectedDonation(base);
        
        try {
            const resp = await getDonationPublicDetails(donationId);
            if (resp?.success) {
                setDonationDetails(resp.data);
            } else {
                setTrackingError(resp?.message || 'Failed to load donation details');
            }
        } catch (err) {
            setTrackingError(err?.response?.data?.message || err.message || 'Failed to load donation details');
        } finally {
            setTrackingLoading(false);
        }
    };

    const handleDownload = (donationId) => {
        console.log('Downloading receipt for donation:', donationId);
        // In a real app, this would trigger a receipt download
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <style>{`
                .scrollable::-webkit-scrollbar {
                    width: 8px;
                }
                .scrollable::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                .scrollable::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .scrollable::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Track your donations and see the impact you're making
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                        {Object.values(filters).filter(v => v !== '' && v !== '2024').length}
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

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>{year}</option>
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
                                        Actions
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
                                            <div className="text-sm text-gray-900">{donation.impact}</div>
                                        </td>

                                        {/* Total */}
                                        <td className="py-4 px-6">
                                            {donation.donationType === 'money' ? (
                                                <div className="text-sm font-bold text-gray-900">₱{donation.amount.toLocaleString()}</div>
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
                                                    <div className="text-sm font-bold text-gray-900">₱{donation.amount.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500">{donation.id}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{donation.goodsTypes}</div>
                                                    <div className="text-xs text-gray-500">{donation.id}</div>
                                                    <div className="text-xs text-blue-600 font-medium">In-Kind</div>
                                                </div>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-6 text-sm text-gray-900">
                                            {new Date(donation.date).toLocaleDateString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleView(donation.id)}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                    trackingDonationId === donation.id
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                }`}
                                            >
                                                {trackingDonationId === donation.id ? 'Tracking' : 'Track'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Empty State */}
                        {filteredDonations.length === 0 && (
                            <div className="text-center py-12">
                                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
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
            </div>

            {/* Tracking Modal - Toggleable */}
            {trackingDonationId && selectedDonation && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setTrackingDonationId(null);
                            setDonationDetails(null);
                            setSelectedDonation(null);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setTrackingDonationId(null);
                            setDonationDetails(null);
                            setSelectedDonation(null);
                        }
                    }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Track Donation</h3>
                            <button
                                onClick={() => {
                                    setTrackingDonationId(null);
                                    setDonationDetails(null);
                                    setSelectedDonation(null);
                                }}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Close tracking"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="overflow-y-auto scrollable p-6 flex-1">

                            {/* Loading State */}
                            {trackingLoading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                        <p className="text-sm text-gray-600">Loading donation details...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {trackingError && !trackingLoading && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800 mb-1">Error Loading Details</p>
                                            <p className="text-xs text-red-600">{trackingError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            {!trackingLoading && !trackingError && (
                                <div className="space-y-6">
                                    {/* Summary Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-500 mb-1">Item</div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {selectedDonation.donationType === 'goods' 
                                                        ? (selectedDonation.goodsTypes || selectedDonation.impact || 'Goods Donation')
                                                        : `₱${selectedDonation.amount?.toLocaleString() || '0'} Money Donation`}
                                                    {selectedDonation.donationType === 'goods' && selectedDonation.goodsQuantity > 0 && 
                                                        ` (${selectedDonation.goodsQuantity} pcs)`
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-500 mb-1">Donated Date</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {selectedDonation.date 
                                                        ? new Date(selectedDonation.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-500 mb-1">Status</div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                                                        selectedDonation.status === 'pending' || !selectedDonation.status
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : selectedDonation.status === 'received' || selectedDonation.status === 'paid'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : selectedDonation.status === 'distribution' || selectedDonation.status === 'in_distribution'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {getStatusIcon(selectedDonation.status)}
                                                        <span className="ml-1 capitalize">{selectedDonation.status || 'Pending'}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-500 mb-1">Delivery ID</div>
                                                <div className="text-sm font-mono font-semibold text-gray-900">
                                                    {selectedDonation.transactionId || selectedDonation.id || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vertical Progress Steps */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="space-y-6">
                                            {/* Donated Step */}
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900">Donated</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Your donation has been submitted</div>
                                                </div>
                                            </div>

                                            {/* Processed by NGO Step */}
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {['received', 'paid', 'distribution', 'in_distribution', 'complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? (
                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-sm font-semibold ${['received', 'paid', 'distribution', 'in_distribution', 'complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        Processed by NGO
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Organization is processing your donation</div>
                                                </div>
                                            </div>

                                            {/* Out for Delivery Step */}
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {['distribution', 'in_distribution', 'complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? (
                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-sm font-semibold ${['distribution', 'in_distribution', 'complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        Out for Delivery
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Donation is being delivered to recipients</div>
                                                </div>
                                            </div>

                                            {/* Received by Recipient Step */}
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {['complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? (
                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-sm font-semibold ${['complete', 'completed', 'verified'].includes(selectedDonation.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        Received by Recipient
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Recipient has received your donation</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-3">
                            <button
                                onClick={() => {
                                    setTrackingDonationId(null);
                                    setDonationDetails(null);
                                    setSelectedDonation(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    // Navigate to detailed view or expand modal
                                    console.log('View more details');
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                View More Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonations;