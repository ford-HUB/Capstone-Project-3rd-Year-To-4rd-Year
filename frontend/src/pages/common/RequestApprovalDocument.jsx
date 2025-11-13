import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText } from 'lucide-react';
import { useDocumentRequestApprovalStore } from '../../store/director/useDocumentRequestApprovalStore.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { documentColorPicker } from '../../utils/documentColorPicker.js';
import DocumentRequestReviewModal from '../../components/modal/DocumentRequestReviewModal.jsx';
import DocumentRequestHeader from '../../components/document-request/DocumentRequestHeader.jsx';
import DocumentRequestFilters from '../../components/document-request/DocumentRequestFilters.jsx';
import DocumentRequestTable from '../../components/document-request/DocumentRequestTable.jsx';
import DocumentRequestBulkActions from '../../components/document-request/DocumentRequestBulkActions.jsx';
import DocumentRequestPagination from '../../components/document-request/DocumentRequestPagination.jsx';
import DocumentRequestBulkRejectModal from '../../components/document-request/DocumentRequestBulkRejectModal.jsx';

const RequestApprovalDocument = () => {
    // Zustand store
    const {
        documentRequests,
        loading,
        error,
        fetchDocumentRequests,
        updateRequestStatus,
        setSelectedRequest,
        selectedRequest
    } = useDocumentRequestApprovalStore();

    // Local state for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [requestTypeFilter, setRequestTypeFilter] = useState('all');
    const [requesterFilter, setRequesterFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
    const [bulkRejectReason, setBulkRejectReason] = useState('');
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    const { authenticatedDirector } = useAuthDirectorStore();

    // Fetch document request approvals using store
    const handleFetchDocumentRequests = async () => {
        const filters = {};
        if (statusFilter !== 'all') filters.status = statusFilter;
        if (priorityFilter !== 'all') filters.priority = priorityFilter;
        if (requestTypeFilter !== 'all') filters.request_type = requestTypeFilter;

        await fetchDocumentRequests(filters);
    };

    useEffect(() => {
        handleFetchDocumentRequests();
    }, [statusFilter, priorityFilter, requestTypeFilter]);

    // Filter and sort requests
    const filteredRequests = documentRequests.filter(request => {
        const matchesSearch = request.document?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.requester?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.document?.category?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRequester = requesterFilter === 'all' || 
                                request.requester?.fullname?.toLowerCase().includes(requesterFilter.toLowerCase());
        
        return matchesSearch && matchesRequester;
    }).sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'document') {
            aValue = a.document?.title || '';
            bValue = b.document?.title || '';
        } else if (sortBy === 'requester') {
            aValue = a.requester?.fullname || '';
            bValue = b.requester?.fullname || '';
        }
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Get unique requesters for filter dropdown
    const uniqueRequesters = [...new Set(documentRequests.map(req => req.requester?.fullname).filter(Boolean))];


    // Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, priorityFilter, requestTypeFilter, requesterFilter]);

    // Close filters when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilters && !event.target.closest('.filter-dropdown')) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    // Handle sorting
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Handle bulk selection
    const handleSelectRequest = (requestId) => {
        // Find the request to check its status
        const request = paginatedRequests.find(r => r.dra_id === requestId);
        
        // Don't allow selection of approved requests
        if (request && request.status === 'approved') {
            return;
        }
        
        setSelectedRequests(prev => 
            prev.includes(requestId) 
                ? prev.filter(id => id !== requestId)
                : [...prev, requestId]
        );
    };

    const handleSelectAll = () => {
        // Only consider non-approved requests for selection
        const selectableRequests = paginatedRequests.filter(r => r.status !== 'approved');
        
        if (selectedRequests.length === selectableRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(selectableRequests.map(r => r.dra_id));
        }
    };

    // Handle status update
    const handleStatusUpdate = async (dra_id, statusData) => {
        try {
            console.log('Frontend - dra_id:', dra_id);
            console.log('Frontend - statusData:', statusData);
            console.log('Frontend - selectedRequest:', selectedRequest);
            
            setActionLoading(true);
            const success = await updateRequestStatus(dra_id, statusData);
            if (success) {
                setShowModal(false);
                setSelectedRequest(null);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setActionLoading(false);
        }
    };

    // Handle approve action
    const handleApprove = async (data) => {
        await handleStatusUpdate(selectedRequest.dra_id, { status: 'approved' });
    };

    // Handle reject action
    const handleReject = async (data) => {
        await handleStatusUpdate(selectedRequest.dra_id, { status: 'rejected', ...data });
    };

    // Handle needs revision action
    const handleNeedsRevision = async (data) => {
        await handleStatusUpdate(selectedRequest.dra_id, { status: 'needs_revision', ...data });
    };

    // Handle bulk approve all
    const handleBulkApproveAll = async () => {
        if (selectedRequests.length === 0) return;
        
        try {
            setBulkActionLoading(true);
            const promises = selectedRequests.map(dra_id => 
                updateRequestStatus(dra_id, { status: 'approved' })
            );
            
            await Promise.all(promises);
            setSelectedRequests([]);
        } catch (error) {
            console.error('Error bulk approving requests:', error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Handle bulk reject all
    const handleBulkRejectAll = async () => {
        if (selectedRequests.length === 0 || !bulkRejectReason.trim()) return;
        
        try {
            setBulkActionLoading(true);
            const promises = selectedRequests.map(dra_id => 
                updateRequestStatus(dra_id, { 
                    status: 'rejected', 
                    rejection_reason: bulkRejectReason.trim() 
                })
            );
            
            await Promise.all(promises);
            setSelectedRequests([]);
            setShowBulkRejectModal(false);
            setBulkRejectReason('');
        } catch (error) {
            console.error('Error bulk rejecting requests:', error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Open bulk reject modal
    const openBulkRejectModal = () => {
        setShowBulkRejectModal(true);
    };

    // Close bulk reject modal
    const closeBulkRejectModal = () => {
        setShowBulkRejectModal(false);
        setBulkRejectReason('');
    };

    // Open review modal
    const openReviewModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    // Get status icon and color
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'needs_revision':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'needs_revision':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get file type icon based on document file type
    const getFileTypeIcon = (fileType) => {
        if (!fileType) return <FileText className="w-5 h-5" />;
        
        // Use the same logic as ManageFiles.jsx
        const colorClass = documentColorPicker(fileType);
        
        // Extract just the background color class
        const bgColor = colorClass.split(' ')[0];
        
        return (
            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                <FileText className="w-5 h-5 text-white" />
            </div>
        );
    };

    // Get file type name for display
    const getFileTypeName = (fileType) => {
        if (!fileType) return 'Unknown';
        
        switch (fileType) {
            case 'application/pdf':
                return 'PDF';
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'Word';
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return 'Excel';
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                return 'PowerPoint';
            case 'image/jpeg':
            case 'image/png':
                return 'Image';
            case 'text/plain':
                return 'Text';
            default:
                return 'File';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <DocumentRequestHeader 
                onRefresh={handleFetchDocumentRequests}
                loading={loading}
            />

            <DocumentRequestFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
            />
            {/* Content */}
            <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-center">
                            <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-lg text-gray-600">Loading document requests...</p>
                            <p className="text-sm text-gray-400 mt-2">Please wait while we fetch your data</p>
                        </div>
                    </div>
                ) : filteredRequests.length > 0 ? (
                    <>
                        <DocumentRequestBulkActions 
                            selectedRequests={selectedRequests}
                            onClearSelection={() => setSelectedRequests([])}
                            onBulkApprove={handleBulkApproveAll}
                            onBulkReject={openBulkRejectModal}
                            bulkActionLoading={bulkActionLoading}
                        />

                        <DocumentRequestTable 
                            requests={paginatedRequests}
                            selectedRequests={selectedRequests}
                            onSelectRequest={handleSelectRequest}
                            onSelectAll={handleSelectAll}
                            onOpenReviewModal={openReviewModal}
                            getFileTypeIcon={getFileTypeIcon}
                            getStatusColor={getStatusColor}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        />

                        <DocumentRequestPagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            totalResults={filteredRequests.length}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            No document requests found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || requestTypeFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria to find what you\'re looking for'
                                : 'No document requests have been submitted yet. Check back later for new requests.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || requestTypeFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setPriorityFilter('all');
                                    setRequestTypeFilter('all');
                                    setRequesterFilter('all');
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            <DocumentRequestBulkRejectModal 
                open={showBulkRejectModal}
                onClose={closeBulkRejectModal}
                onConfirm={handleBulkRejectAll}
                selectedCount={selectedRequests.length}
                rejectReason={bulkRejectReason}
                setRejectReason={setBulkRejectReason}
                loading={bulkActionLoading}
            />

            {/* Document Request Review Modal */}
            <DocumentRequestReviewModal
                open={showModal}
                setOpen={setShowModal}
                request={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={actionLoading}
            />
        </div>
    );
};

export default RequestApprovalDocument;
