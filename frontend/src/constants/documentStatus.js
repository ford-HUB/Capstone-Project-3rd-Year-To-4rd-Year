// Document approval status constants and helper functions

// Status values
export const DOCUMENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    NEEDS_REVISION: 'needs_revision',
    IGNORED: 'ignored',
    NO_REQUEST: 'no_request'
};

// Helper function to get status color
export const getStatusColor = (status) => {
    switch (status) {
        case DOCUMENT_STATUS.PENDING:
            return 'text-yellow-600 bg-yellow-100';
        case DOCUMENT_STATUS.APPROVED:
            return 'text-green-600 bg-green-100';
        case DOCUMENT_STATUS.REJECTED:
            return 'text-red-600 bg-red-100';
        case DOCUMENT_STATUS.NEEDS_REVISION:
            return 'text-orange-600 bg-orange-100';
        case DOCUMENT_STATUS.IGNORED:
            return 'text-gray-600 bg-gray-100';
        case DOCUMENT_STATUS.NO_REQUEST:
            return 'text-blue-600 bg-blue-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

// Helper function to get status icon
export const getStatusIcon = (status) => {
    switch (status) {
        case DOCUMENT_STATUS.PENDING:
            return '';
        case DOCUMENT_STATUS.APPROVED:
            return '';
        case DOCUMENT_STATUS.REJECTED:
            return '';
        case DOCUMENT_STATUS.NEEDS_REVISION:
            return '';
        case DOCUMENT_STATUS.IGNORED:
            return '';
        case DOCUMENT_STATUS.NO_REQUEST:
            return '';
        default:
            return '❓';
    }
};

// Helper function to get status text
export const getStatusText = (status) => {
    switch (status) {
        case DOCUMENT_STATUS.PENDING:
            return 'Waiting for Approval';
        case DOCUMENT_STATUS.APPROVED:
            return 'Approved';
        case DOCUMENT_STATUS.REJECTED:
            return 'Rejected';
        case DOCUMENT_STATUS.NEEDS_REVISION:
            return 'Needs Revision';
        case DOCUMENT_STATUS.IGNORED:
            return 'Ignored';
        case DOCUMENT_STATUS.NO_REQUEST:
            return 'No Approval Request';
        default:
            return 'Unknown Status';
    }
};

// Status priority for sorting
export const getStatusPriority = (status) => {
    switch (status) {
        case DOCUMENT_STATUS.PENDING:
            return 1;
        case DOCUMENT_STATUS.NEEDS_REVISION:
            return 2;
        case DOCUMENT_STATUS.REJECTED:
            return 3;
        case DOCUMENT_STATUS.IGNORED:
            return 4;
        case DOCUMENT_STATUS.APPROVED:
            return 5;
        case DOCUMENT_STATUS.NO_REQUEST:
            return 6;
        default:
            return 7;
    }
};

// Check if status requires action
export const requiresAction = (status) => {
    return status === DOCUMENT_STATUS.PENDING || status === DOCUMENT_STATUS.NEEDS_REVISION;
};

// Check if status is final (no further changes expected)
export const isFinalStatus = (status) => {
    return status === DOCUMENT_STATUS.APPROVED || 
           status === DOCUMENT_STATUS.REJECTED || 
           status === DOCUMENT_STATUS.IGNORED;
};
