import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Eye,
    FileText,
    User,
    Calendar,
    Download,
    RefreshCw,
    Plus,
    Send
} from 'lucide-react';
import { getDocumentRequestApprovals, createDocumentRequestApproval } from '../../services/director/documentRequestApprovalService.js';
import { getAllDocuments } from '../../services/common/documentService.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';

const MyDocumentRequests = () => {
    const [documentRequests, setDocumentRequests] = useState([]);
    const [myDocuments, setMyDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [requestForm, setRequestForm] = useState({
        request_type: 'approval',
        request_reason: '',
        priority: 'medium',
        due_date: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const { authenticatedManagement } = useAuthManagementStore();

    // Fetch my document requests
    const fetchMyDocumentRequests = async () => {
        try {
            setLoading(true);
            const response = await getDocumentRequestApprovals({ requested_by: authenticatedManagement?.account_id });
            if (response.success) {
                setDocumentRequests(response.data);
            } else {
                console.error('Error fetching my document requests:', response.message);
            }
        } catch (error) {
            console.error('Error fetching my document requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch my documents
    const fetchMyDocuments = async () => {
        try {
            const response = await getAllDocuments();
            if (response.success) {
                // Filter to only show my documents
                const myDocs = response.list.filter(doc => doc.author_id === authenticatedManagement?.account_id);
                setMyDocuments(myDocs);
            }
        } catch (error) {
            console.error('Error fetching my documents:', error);
        }
    };

    useEffect(() => {
        fetchMyDocumentRequests();
        fetchMyDocuments();
    }, [authenticatedManagement?.account_id]);

    // Filter requests based on search term and status
    const filteredRequests = documentRequests.filter(request => {
        const matchesSearch = request.document?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             request.document?.category?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Handle creating new request
    const handleCreateRequest = async () => {
        try {
            setSubmitting(true);
            const requestData = {
                document_id: selectedDocument.document_id,
                ...requestForm
            };

            const response = await createDocumentRequestApproval(requestData);
            if (response.success) {
                setShowRequestModal(false);
                setSelectedDocument(null);
                setRequestForm({
                    request_type: 'approval',
                    request_reason: '',
                    priority: 'medium',
                    due_date: ''
                });
                await fetchMyDocumentRequests();
            } else {
                console.error('Error creating request:', response.message);
            }
        } catch (error) {
            console.error('Error creating request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Open request modal
    const openRequestModal = (document) => {
        setSelectedDocument(document);
        setShowRequestModal(true);
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

    // Check if document already has a pending request
    const hasPendingRequest = (documentId) => {
        return documentRequests.some(request => 
            request.document_id === documentId && request.status === 'pending'
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Document Requests
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track the status of your document approval requests
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            fetchMyDocumentRequests();
                            fetchMyDocuments();
                        }}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by document title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="needs_revision">Needs Revision</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading your document requests...</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* My Document Requests */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Document Request Status
                                </h2>
                            </div>
                            
                            {filteredRequests.length > 0 ? (
                                <div className="p-6 space-y-4">
                                    {filteredRequests.map((request) => (
                                        <div key={request.dra_id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {request.document?.title}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                            {request.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                                            {request.priority.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                <strong>Category:</strong> {request.document?.category}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                <strong>Requested:</strong> {new Date(request.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-gray-600">
                                                                <strong>Type:</strong> {request.request_type}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {request.request_reason && (
                                                        <div className="mb-4">
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Your Reason:</strong> {request.request_reason}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {request.review_notes && (
                                                        <div className="mb-4">
                                                            <p className="text-sm text-blue-600">
                                                                <strong>Reviewer Notes:</strong> {request.review_notes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {request.rejection_reason && (
                                                        <div className="mb-4">
                                                            <p className="text-sm text-red-600">
                                                                <strong>Rejection Reason:</strong> {request.rejection_reason}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    <a
                                                        href={request.document?.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No document requests found
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm || statusFilter !== 'all'
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'You haven\'t submitted any document requests yet'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* My Documents - Available for Request */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    My Documents - Request Approval
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Select a document to request approval from the director
                                </p>
                            </div>
                            
                            {myDocuments.length > 0 ? (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {myDocuments.map((document) => (
                                            <div key={document.document_id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {document.title}
                                                    </h3>
                                                    {hasPendingRequest(document.document_id) && (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2 mb-4">
                                                    <p className="text-xs text-gray-600">
                                                        <strong>Category:</strong> {document.category}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        <strong>Uploaded:</strong> {new Date(document.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => openRequestModal(document)}
                                                    disabled={hasPendingRequest(document.document_id)}
                                                    className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        hasPendingRequest(document.document_id)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {hasPendingRequest(document.document_id) ? (
                                                        <>
                                                            <Clock className="w-4 h-4" />
                                                            <span>Request Pending</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            <span>Request Approval</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No documents found
                                    </h3>
                                    <p className="text-gray-500">
                                        Upload some documents first to request approval
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Request Modal */}
            {showRequestModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Request Document Approval
                        </h2>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Document:</strong> {selectedDocument.title}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Category:</strong> {selectedDocument.category}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Request Type
                                </label>
                                <select
                                    value={requestForm.request_type}
                                    onChange={(e) => setRequestForm({...requestForm, request_type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="approval">Approval</option>
                                    <option value="revision">Revision</option>
                                    <option value="publication">Publication</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={requestForm.priority}
                                    onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Request Reason *
                                </label>
                                <textarea
                                    value={requestForm.request_reason}
                                    onChange={(e) => setRequestForm({...requestForm, request_reason: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Explain why you need this document approved..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={requestForm.due_date}
                                    onChange={(e) => setRequestForm({...requestForm, due_date: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRequest}
                                disabled={submitting || !requestForm.request_reason.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDocumentRequests;
