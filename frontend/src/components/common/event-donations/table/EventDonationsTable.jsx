import React, { useState, useMemo } from 'react';
import {
    Search,
    MoreVertical,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    DollarSign,
    User,
    Calendar,
    Tag,
    Filter
} from 'lucide-react';
import dayjs from 'dayjs';

const EventDonationsTable = ({
    donations = [],
    searchTerm,
    selectedDonations,
    onSearchChange,
    onToggleSelection,
    onSelectAll,
    onStatusUpdate,
    showRecentOnly = false,
    showDonorFocus = false
}) => {
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Filter and sort donations
    const filteredDonations = useMemo(() => {
        let filtered = donations.filter((donation) => {
            const matchesSearch = 
                donation.donor?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.event?.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesSearch;
        });

        // Sort donations
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            if (sortField === 'amount') {
                aValue = a.payments?.[0]?.amount || 0;
                bValue = b.payments?.[0]?.amount || 0;
            }
            
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [donations, searchTerm, sortField, sortDirection]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'RECEIVED':
                return <CheckCircle className="w-4 h-4 text-blue-600" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'DELIVERED':
                return <CheckCircle className="w-4 h-4 text-purple-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'RECEIVED':
                return 'bg-blue-100 text-blue-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'DELIVERED':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'MONEY':
                return <DollarSign className="w-4 h-4 text-green-600" />;
            case 'GOODS':
                return <Tag className="w-4 h-4 text-blue-600" />;
            default:
                return <Tag className="w-4 h-4 text-gray-600" />;
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleStatusChange = async (donationId, newStatus) => {
        try {
            await onStatusUpdate(donationId, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Search - only show if not recent only mode */}
            {!showRecentOnly && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={showDonorFocus ? "Search donors..." : "Search donations..."}
                                    value={searchTerm}
                                    onChange={onSearchChange}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            {filteredDonations.length} {showDonorFocus ? 'donor' : 'donation'}{filteredDonations.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedDonations.length === filteredDonations.length && filteredDonations.length > 0}
                                    onChange={() => onSelectAll(filteredDonations)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('donor')}
                            >
                                <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>Donor</span>
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('event')}
                            >
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Event</span>
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('amount')}
                            >
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Amount</span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Date</span>
                                </div>
                            </th>
                            {!showRecentOnly && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDonations.map((donation) => (
                            <tr key={donation.donation_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedDonations.includes(donation.donation_id)}
                                        onChange={() => onToggleSelection(donation.donation_id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
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
                                        {getTypeIcon(donation.donation_type)}
                                        <span className="text-sm text-gray-900">
                                            {donation.donation_type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                        {getStatusIcon(donation.status)}
                                        <span className="ml-1">{donation.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dayjs(donation.createdAt).format('MMM DD, YYYY')}
                                </td>
                                {!showRecentOnly && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleStatusChange(donation.donation_id, 'RECEIVED')}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Mark as Received"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(donation.donation_id, 'DELIVERED')}
                                                className="text-green-600 hover:text-green-900"
                                                title="Mark as Delivered"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(donation.donation_id, 'COMPLETED')}
                                                className="text-purple-600 hover:text-purple-900"
                                                title="Mark as Completed"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredDonations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500">
                        No donations found matching your criteria.
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDonationsTable;
