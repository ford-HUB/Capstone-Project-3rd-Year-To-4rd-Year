import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Download } from 'lucide-react';
import dayjs from 'dayjs';

// Components
import InternalDonationTable from '../../components/common/internal-donation-tracking/table/InternalDonationTable';
import InternalDonationFilters from '../../components/common/internal-donation-tracking/ui/InternalDonationFilters';
import LastUpdated from '../../components/common/internal-donation-tracking/ui/LastUpdated';
import InternalDonationEmptyState from '../../components/common/internal-donation-tracking/state/InternalDonationEmptyState';
import DonationDashboard from '../../components/common/internal-donation-tracking/dashboard/DonationDashboard';

// Hooks
import { useDonationFilters } from '../../hooks/useDonationFilters';
import { useDonationActions } from '../../hooks/useDonationActions';
import { useInternalDonationStore } from '../../store/common/useInternalDonationStore';
import { getDashboardStats } from '../../services/common/donationTrackingService';

const InternalDonationTracking = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage] = useState(10);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);

    const { getInternalDonationList, pagination } = useInternalDonationStore();

    const {
        searchTerm,
        selectedDonations,
        filterStatus,
        filterType,
        filterEvent,
        eventOptions,
        allDonations,
        filteredDonations,
        loading,
        setSearchTerm,
        setFilterStatus,
        setFilterType,
        setFilterEvent,
        toggleDonationSelection,
        selectAllDonations
    } = useDonationFilters();

    const {
        handleStatusUpdate,
        handleBulkStatusUpdate,
        handleExport,
        initializeData,
        getLatestDonationDate
    } = useDonationActions();

    // Dashboard event filter state
    const [dashboardEventFilter, setDashboardEventFilter] = React.useState('all');

    // Fetch dashboard stats
    const fetchDashboardStats = useCallback(async (event = 'all') => {
        setDashboardStatsLoading(true);
        try {
            const result = await getDashboardStats({ event });
            if (result.success) {
                setDashboardStats(result.data);
            } else {
                console.error('Failed to fetch dashboard stats:', result.message);
                setDashboardStats(null);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            setDashboardStats(null);
        } finally {
            setDashboardStatsLoading(false);
        }
    }, []);

    // Fetch dashboard stats on mount and when event filter changes
    useEffect(() => {
        fetchDashboardStats(dashboardEventFilter);
    }, [dashboardEventFilter, fetchDashboardStats]);

    // Fetch donations with current filters and pagination
    const fetchDonations = useCallback(async (page, search, status, type, event) => {
        const params = {
            page: page,
            limit: limitPerPage,
            status: status !== 'all' ? status : undefined,
            type: type !== 'all' ? type : undefined,
            search: search || undefined,
            event: event && event !== 'all' ? event : undefined
        };
        
        await getInternalDonationList(params);
    }, [getInternalDonationList, limitPerPage]);

    // Initialize data on component mount
    useEffect(() => {
        fetchDonations(1, '', 'all', 'all', 'all');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle filter changes - reset to page 1 and fetch
    useEffect(() => {
        setCurrentPage(1);
        fetchDonations(1, searchTerm, filterStatus, filterType, filterEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, filterType, filterEvent]);

    // Handle search with debouncing
    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setCurrentPage(1);
            fetchDonations(1, searchTerm, filterStatus, filterType, filterEvent);
        }, 500); // 500ms debounce

        setSearchTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // Handle page change
    const handlePageChange = useCallback(async (newPage) => {
        setCurrentPage(newPage);
        await fetchDonations(newPage, searchTerm, filterStatus, filterType, filterEvent);
    }, [searchTerm, filterStatus, filterType, filterEvent, fetchDonations]);

    // Dashboard stats are now calculated on frontend, no need for API calls

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg text-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading donation data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard */}
                <DonationDashboard
                    stats={dashboardStats}
                    selectedEvent={dashboardEventFilter}
                    onEventChange={setDashboardEventFilter}
                    eventOptions={eventOptions}
                    loading={dashboardStatsLoading}
                />

                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Internal Donation Tracking
                        </h1>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-semibold">
                                    Today's Donations
                                </h2>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>Date:</span>
                                    <span className="font-medium">
                                        {dayjs().format('MMMM D, YYYY')}
                                    </span>
                                    <Calendar className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export Report</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-500">
                                Live tracking active
                            </div>
                            <LastUpdated lastUpdated={getLatestDonationDate()} />
                        </div>
                    </div>
                </div>

                {/* Filters - Always visible */}
                <InternalDonationFilters
                    filterStatus={filterStatus}
                    filterType={filterType}
                    filterEvent={filterEvent}
                    openDonationEvents={eventOptions}
                    onStatusChange={setFilterStatus}
                    onTypeChange={setFilterType}
                    onEventChange={setFilterEvent}
                />

                {/* Table or Empty State */}
                {filteredDonations?.length > 0 ? (
                    <InternalDonationTable
                        donations={filteredDonations}
                        searchTerm={searchTerm}
                        selectedDonations={selectedDonations}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        onToggleSelection={toggleDonationSelection}
                        onSelectAll={selectAllDonations}
                        onStatusUpdate={handleStatusUpdate}
                        onBulkStatusUpdate={handleBulkStatusUpdate}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                ) : (
                    <InternalDonationEmptyState 
                        hasActiveFilters={
                            filterStatus !== 'all' || 
                            filterType !== 'all' || 
                            filterEvent !== 'all' || 
                            searchTerm !== ''
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default InternalDonationTracking;