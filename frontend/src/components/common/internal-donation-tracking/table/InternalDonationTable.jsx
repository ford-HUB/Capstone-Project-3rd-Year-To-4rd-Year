import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Package, DollarSign, User, Mail, MoreVertical, Eye } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import DonationConfirmationModal from '../../../modal/DonationConfirmationModal';
import DonationViewDetailsModal from '../../../modal/DonationViewDetailsModal';
import BulkDonationConfirmationModal from '../../../modal/BulkDonationConfirmationModal';
import Pagination from '../../../common/pagination/Pagination';

const InternalDonationTable = ({
    donations,
    searchTerm,
    selectedDonations,
    onSearchChange,
    onToggleSelection,
    onSelectAll,
    onStatusUpdate,
    onBulkStatusUpdate,
    pagination,
    onPageChange
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        donation: null,
        loading: false
    });
    const [viewDetailsModal, setViewDetailsModal] = useState({
        isOpen: false,
        donation: null
    });
    const [bulkConfirmationModal, setBulkConfirmationModal] = useState({
        isOpen: false,
        loading: false
    });

    const formatEmail = (email, isAnonymous) => {
        if (!email) return 'N/A';
        
        if (isAnonymous) {
            if (email.length <= 4) return email;
            return email.substring(0, 4) + '#'.repeat(4);
        }
        
        return email;
    };

    const filteredDonations = donations?.filter(donation => {
        const donorName = donation.is_anonymous ? 'Anonymous' : (donation.Account?.Donor?.fullname || 'Anonymous');
        const donorEmail = donation.Account?.email || '';
        const eventName = donation.Event?.title || '';
        const goodsDescription = donation.GoodsDonation?.detailed_description || '';
        const goodsType = donation.GoodsDonation?.type_goods?.join(', ') || '';
        
        return (
            donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goodsDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goodsType.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Only consider goods donations with PENDING status for selection
    const goodsDonations = filteredDonations?.filter(donation => 
        donation.donation_type === 'GOODS' && donation.status === 'PENDING'
    ) || [];
    const allSelected = selectedDonations.length === goodsDonations.length && goodsDonations.length > 0;

    const handleBulkAction = async () => {
        if (selectedDonations.length === 0) {
            toast.error('Please select donations to perform bulk action');
            return;
        }

        // Filter selected donations to only include goods donations with pending status
        const validDonations = donations.filter(donation => 
            selectedDonations.includes(donation.donation_id) &&
            donation.donation_type === 'GOODS' &&
            donation.status === 'PENDING'
        );

        if (validDonations.length === 0) {
            toast.error('Selected donations must be goods donations with pending status');
            return;
        }

        if (validDonations.length !== selectedDonations.length) {
            const invalidCount = selectedDonations.length - validDonations.length;
            if (!confirm(`${invalidCount} selected donations are not goods donations with pending status. Only ${validDonations.length} valid donations will be updated. Continue?`)) {
                return;
            }
        }

        // Open bulk confirmation modal with valid donations
        setBulkConfirmationModal({
            isOpen: true,
            loading: false
        });
    };

    const handleStatusUpdate = (donationId, currentStatus) => {
        if (currentStatus === 'PENDING') {
            // Find the donation to show in modal
            const donation = donations.find(d => d.donation_id === donationId);
            setConfirmationModal({
                isOpen: true,
                donation: donation,
                loading: false
            });
        }
        setOpenDropdown(null); // Close dropdown after action
    };

    const handleConfirmStatusUpdate = async () => {
        if (!confirmationModal.donation) return;

        setConfirmationModal(prev => ({ ...prev, loading: true }));

        try {
            await onStatusUpdate(confirmationModal.donation.donation_id, 'RECEIVED');
            setConfirmationModal({
                isOpen: false,
                donation: null,
                loading: false
            });
        } catch (error) {
            console.error('Failed to update donation status:', error);
            setConfirmationModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handleCloseConfirmationModal = () => {
        if (!confirmationModal.loading) {
            setConfirmationModal({
                isOpen: false,
                donation: null,
                loading: false
            });
        }
    };

    const handleBulkConfirm = async () => {
        setBulkConfirmationModal(prev => ({ ...prev, loading: true }));
        
        try {
            // Filter selected donations to only include goods donations with pending status
            const validDonations = donations.filter(donation => 
                selectedDonations.includes(donation.donation_id) &&
                donation.donation_type === 'GOODS' &&
                donation.status === 'PENDING'
            );
            
            const validDonationIds = validDonations.map(d => d.donation_id);
            await onBulkStatusUpdate(validDonationIds, 'RECEIVED');
            
            // Close modal after successful update
            setBulkConfirmationModal({
                isOpen: false,
                loading: false
            });
        } catch (error) {
            console.error('Failed to bulk update donation status:', error);
            setBulkConfirmationModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handleBulkClose = () => {
        if (!bulkConfirmationModal.loading) {
            setBulkConfirmationModal({
                isOpen: false,
                loading: false
            });
        }
    };

    const toggleDropdown = (donationId) => {
        setOpenDropdown(openDropdown === donationId ? null : donationId);
    };

    const handleViewDetails = (donationId) => {
        const donation = donations.find(d => d.donation_id === donationId);
        setViewDetailsModal({
            isOpen: true,
            donation: donation
        });
        setOpenDropdown(null); // Close dropdown after action
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    return (
        <>
        <div className="bg-white rounded-lg shadow-sm">
            {/* Search and Actions */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Search donors, events, or goods..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={handleBulkAction}
                            disabled={selectedDonations.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mark as Received ({selectedDonations.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                    checked={allSelected}
                                    onChange={() => onSelectAll(goodsDonations)}
                                />
                                Donor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Goods/Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDonations?.map((donation) => (
                            <tr key={donation.donation_id} className="hover:bg-gray-50">
                                {/* Donor */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 ${
                                                donation.donation_type === 'MONEY' || donation.status !== 'PENDING'
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : ''
                                            }`}
                                            checked={selectedDonations.includes(donation.donation_id)}
                                            onChange={() => onToggleSelection(donation.donation_id)}
                                            disabled={donation.donation_type === 'MONEY' || donation.status !== 'PENDING'}
                                        />
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {donation.is_anonymous ? 'Anonymous' : (donation.Account?.Donor?.fullname || 'Anonymous')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatEmail(donation.Account?.email, donation.is_anonymous)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Event */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {donation.Event?.title || 'N/A'}
                                    </div>
                                </td>

                                {/* Type */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        {donation.donation_type === 'GOODS' ? (
                                            <Package className="w-4 h-4 text-orange-500" />
                                        ) : (
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                        )}
                                        <span className="text-sm text-gray-900">
                                            {donation.donation_type}
                                        </span>
                                    </div>
                                </td>

                                {/* Goods/Amount */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {donation.donation_type === 'GOODS' ? (
                                        <div className="text-sm font-medium text-gray-900">
                                            {donation.GoodsDonation?.[0]?.type_goods || 
                                             donation.GoodsDonation?.type_goods || 
                                             donation.goods_description || 
                                             'N/A'}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                ₱{typeof donation.amount === 'number' 
                                                    ? donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                    : (donation.Payments?.[0]?.amount 
                                                        ? parseFloat(donation.Payments[0].amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                        : '0.00')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {donation.Payments?.[0]?.currency || 'PHP'}
                                            </div>
                                        </div>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        donation.status === 'DISTRIBUTED' ? 'bg-purple-100 text-purple-800' :
                                        donation.status === 'RECEIVED' ? 'bg-blue-100 text-blue-800' :
                                        donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {donation.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                                         donation.status === 'DISTRIBUTED' ? <Package className="w-4 h-4 text-purple-600" /> :
                                         donation.status === 'RECEIVED' ? <CheckCircle className="w-4 h-4 text-blue-600" /> :
                                         donation.status === 'PENDING' ? <Clock className="w-4 h-4 text-yellow-600" /> :
                                         <AlertCircle className="w-4 h-4 text-gray-600" />}
                                        <span className="ml-1">{donation.status}</span>
                                    </span>
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dayjs(donation.createdAt).format('MMM DD, YYYY')}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative dropdown-container">
                                        <button
                                            onClick={() => toggleDropdown(donation.donation_id)}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        
                                        {openDropdown === donation.donation_id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                                <div className="py-1">
                                                    {donation.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(donation.donation_id, donation.status)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                                            Mark as Received
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleViewDetails(donation.donation_id)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Total: {pagination?.totalCount || filteredDonations?.length || 0} donations</span>
                        <span>Selected: {selectedDonations.length}</span>
                        {pagination && (
                            <span>
                                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                                {pagination.totalCount}
                            </span>
                        )}
                    </div>
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={onPageChange}
                            showInfo={false}
                            className="flex items-center space-x-2"
                        />
                    )}
                </div>
            </div>
        </div>

        {/* Confirmation Modal */}
        <DonationConfirmationModal
            isOpen={confirmationModal.isOpen}
            onClose={handleCloseConfirmationModal}
            onConfirm={handleConfirmStatusUpdate}
            donation={confirmationModal.donation}
            loading={confirmationModal.loading}
        />

        {/* View Details Modal */}
        <DonationViewDetailsModal
            isOpen={viewDetailsModal.isOpen}
            onClose={() => setViewDetailsModal({ isOpen: false, donation: null })}
            donation={viewDetailsModal.donation}
        />

        {/* Bulk Confirmation Modal */}
        <BulkDonationConfirmationModal
            isOpen={bulkConfirmationModal.isOpen}
            onClose={handleBulkClose}
            onConfirm={handleBulkConfirm}
            selectedDonations={donations.filter(donation => 
                selectedDonations.includes(donation.donation_id) &&
                donation.donation_type === 'GOODS' &&
                donation.status === 'PENDING'
            )}
            loading={bulkConfirmationModal.loading}
        />
    </>
    );
};

export default InternalDonationTable;
