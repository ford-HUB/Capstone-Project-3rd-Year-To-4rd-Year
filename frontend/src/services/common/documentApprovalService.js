import { apiInstance } from '../../api/_base.js';

// Get documents with approval status
export const getDocumentsWithApprovalStatus = async () => {
    try {
        const response = await apiInstance.get('/document/documents-list');
        return response.data;
    } catch (error) {
        console.error('Error fetching documents with approval status:', error);
        throw error;
    }
};

// Get approval status for a specific document
export const getDocumentApprovalStatus = async (documentId) => {
    try {
        const response = await apiInstance.get(`/document-request-approval/document/${documentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching document approval status:', error);
        throw error;
    }
};

// Get pending documents for directors
export const getPendingDocuments = async () => {
    try {
        const response = await apiInstance.get('/document-request-approval/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending documents:', error);
        throw error;
    }
};

// Approve a document
export const approveDocument = async (approvalId, reviewNotes = '') => {
    try {
        const response = await apiInstance.put(`/document-request-approval/${approvalId}/status`, {
            status: 'approved',
            review_notes: reviewNotes
        });
        return response.data;
    } catch (error) {
        console.error('Error approving document:', error);
        throw error;
    }
};

// Reject a document
export const rejectDocument = async (approvalId, rejectionReason, reviewNotes = '') => {
    try {
        const response = await apiInstance.put(`/document-request-approval/${approvalId}/status`, {
            status: 'rejected',
            rejection_reason: rejectionReason,
            review_notes: reviewNotes
        });
        return response.data;
    } catch (error) {
        console.error('Error rejecting document:', error);
        throw error;
    }
};

// Mark document as needs revision
export const markDocumentForRevision = async (approvalId, reviewNotes = '') => {
    try {
        const response = await apiInstance.put(`/document-request-approval/${approvalId}/status`, {
            status: 'needs_revision',
            review_notes: reviewNotes
        });
        return response.data;
    } catch (error) {
        console.error('Error marking document for revision:', error);
        throw error;
    }
};
