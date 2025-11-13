import React, { useState, useEffect } from 'react';
import {
    Calendar,
    FileText,
    Settings,
    DollarSign,
    Users,
    Filter,
    Search,
    MoreVertical,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    TrendingUp,
    Download,
    User,
    Tag
} from 'lucide-react';
import NavigationTabs from '../../components/common/event-donations/Navigation/NavigationTabs';
import EventDonationsTable from '../../components/common/event-donations/table/EventDonationsTable';
import { useEventDonationsStore } from '../../store/common/useEventDonationsStore.js';
import EventDonationsStats from '../../components/common/event-donations/ui/EventDonationsStats.jsx';
import EventDonationsFilters from '../../components/common/event-donations/ui/EventDonationsFilters.jsx';
import LastUpdated from '../../components/common/event-donations/ui/LastUpdated.jsx';
import EventDonationsEmptyState from '../../components/common/event-donations/state/EventDonationsEmptyState.jsx';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const EventDonations = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDonations, setSelectedDonations] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';

    React.useEffect(() => {
        setSearchParams({ tab: 'dashboard' });
    }, []);

    const { 
        getEventDonations, 
        eventDonationsData, 
        loading, 
        stats,
        updateDonationStatus,
        exportDonations 
    } = useEventDonationsStore();

    React.useEffect(() => {
        const fetchData = async () => {
            await getEventDonations();
        };
        fetchData();
    }, []);

    // Toggle donation selection
    const toggleDonationSelection = (donationId) => {
        setSelectedDonations((prev) =>
            prev.includes(donationId)
                ? prev.filter((id) => id !== donationId)
                : [...prev, donationId]
        );
    };

    // Select all donations
    const selectAllDonations = (filteredList) => {
        if (selectedDonations.length === filteredList.length) {
            setSelectedDonations([]);
        } else {
            setSelectedDonations(filteredList.map((d) => d.donation_id));
        }
    };

    const handleStatusUpdate = async (donationId, newStatus) => {
        try {
            await updateDonationStatus(donationId, newStatus);
            await getEventDonations();
        } catch (error) {
            console.error('Failed to update donation status:', error);
        }
    };

    const handleExport = async () => {
        try {
            await exportDonations(selectedDonations);
        } catch (error) {
            console.error('Failed to export donations:', error);
        }
    };

    // Navigation tabs data
    const navTabs = [
        {
            key: 'dashboard',
            icon: TrendingUp,
            label: 'Dashboard',
        },
        {
            key: 'donation-records',
            icon: FileText,
            label: 'Donation Records',
        },
    ];

    const handleTabChange = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Tabs */}
                <NavigationTabs
                    tabs={navTabs}
                    activeTab={currentTab}
                    onTabChange={handleTabChange}
                />

                {/* Dashboard Tab Content */}
                {currentTab === 'dashboard' && (
                    <>
                        {/* Dashboard with Statistics */}
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Event Donations Dashboard
                                </h1>
                            </div>
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <h2 className="text-xl font-semibold">
                                            Donation Overview
                                        </h2>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <span>Last Updated:</span>
                                            <span className="font-medium">
                                                {dayjs().format('MMMM D, YYYY [at] h:mm A')}
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
                                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                </div>

                                <EventDonationsStats stats={stats} />

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm text-gray-500">
                                        Viewing event donations
                                    </div>
                                    <LastUpdated lastUpdated={stats?.lastUpdated} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Donors Section - Part of Dashboard */}
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Donors</h3>
                                    <div className="text-sm text-gray-500">
                                        {eventDonationsData?.length || 0} recent donor{eventDonationsData?.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                            {eventDonationsData?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Donor
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {eventDonationsData.slice(0, 10).map((donation) => (
                                                <tr key={donation.donation_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-gray-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {donation.donor?.fullname || 'Anonymous'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {donation.donor?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {donation.event?.title || 'General Donation'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {donation.event?.category?.name || 'No Category'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            ₱{donation.payments?.[0]?.amount?.toLocaleString() || '0.00'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {donation.payments?.[0]?.currency || 'PHP'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {donation.donation_type === 'MONEY' ? (
                                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <Tag className="w-4 h-4 text-blue-600" />
                                                            )}
                                                            <span className="text-sm text-gray-900">
                                                                {donation.donation_type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                            donation.status === 'RECEIVED' ? 'bg-blue-100 text-blue-800' :
                                                            donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            donation.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {donation.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                                                             donation.status === 'RECEIVED' ? <CheckCircle className="w-4 h-4 text-blue-600" /> :
                                                             donation.status === 'PENDING' ? <Clock className="w-4 h-4 text-yellow-600" /> :
                                                             donation.status === 'DELIVERED' ? <CheckCircle className="w-4 h-4 text-purple-600" /> :
                                                             <AlertCircle className="w-4 h-4 text-gray-600" />}
                                                            <span className="ml-1">{donation.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {dayjs(donation.createdAt).format('MMM DD, YYYY')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="px-6 py-12">
                                    <EventDonationsEmptyState />
                                </div>
                            )}
                        </div>
                    </>
                )}
                
                {/* Donation Records Tab Content */}
                {currentTab === 'donation-records' && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Donations
                            </h1>
                        </div>
                        <div className="px-6 py-4">
                            <EventDonationsFilters
                                filterStatus={filterStatus}
                                filterType={filterType}
                                dateRange={dateRange}
                                onStatusChange={setFilterStatus}
                                onTypeChange={setFilterType}
                                onDateRangeChange={setDateRange}
                            />
                            <EventDonationsTable
                                donations={eventDonationsData}
                                searchTerm={searchTerm}
                                selectedDonations={selectedDonations}
                                onSearchChange={(e) => setSearchTerm(e.target.value)}
                                onToggleSelection={toggleDonationSelection}
                                onSelectAll={selectAllDonations}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDonations;
