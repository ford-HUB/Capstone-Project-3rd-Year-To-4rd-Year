import { apiInstance } from "../../api/_base.js";

// Get all document request approvals with optional filters
export const getDocumentRequestApprovals = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        const url = `/api/director/document-request-approval/list-request-approvals?${params.toString()}`;
        const response = await apiInstance.get(url);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error fetching document request approvals:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch document request approvals',
            data: []
        };
    }
};

// Get single document request approval by ID
export const getDocumentRequestApprovalById = async (dra_id) => {
    try {
        const response = await apiInstance.get(`/api/director/document-request-approval/get-request-approval/${dra_id}`);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error fetching document request approval:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch document request approval',
            data: null
        };
    }
};

// Create new document request approval
export const createDocumentRequestApproval = async (requestData) => {
    try {
        const response = await apiInstance.post('/api/director/document-request-approval/create-request-approval', requestData);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error creating document request approval:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create document request approval',
            data: null
        };
    }
};

// Update document request approval status (approve/reject)
export const updateDocumentRequestApprovalStatus = async (dra_id, statusData) => {
    try {
        console.log('Service call - dra_id:', dra_id);
        console.log('Service call - statusData:', statusData);
        
        const response = await apiInstance.put(`/api/director/document-request-approval/update-request-status/${dra_id}`, statusData);
        
        console.log('Service response:', response.data);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.error('Error updating document request approval status:', error);
        console.error('Error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update document request approval status',
            data: null
        };
    }
};

// Delete document request approval
export const deleteDocumentRequestApproval = async (dra_id) => {
    try {
        const response = await apiInstance.delete(`/api/director/document-request-approval/delete-request-approval/${dra_id}`);
        
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        console.error('Error deleting document request approval:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete document request approval'
        };
    }
};

// Get documents by date for monitoring
export const getDocumentsByDateForMonitoring = async (date) => {
    try {
        const response = await apiInstance.get(`/api/director/document-request-approval/monitoring/documents-by-date?date=${date}`);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data || []
        };
    } catch (error) {
        console.error('Error fetching documents by date:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch documents by date',
            data: []
        };
    }
};

// Get all coordinators for monitoring
export const getAllCoordinatorsForMonitoring = async () => {
    try {
        const response = await apiInstance.get('/api/director/document-request-approval/monitoring/coordinators');
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data || []
        };
    } catch (error) {
        console.error('Error fetching coordinators:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch coordinators',
            data: []
        };
    }
};

// Get calendar data for document monitoring
export const getDocumentMonitoringCalendar = async (year, month) => {
    try {
        const response = await apiInstance.get(`/api/director/document-request-approval/monitoring/calendar?year=${year}&month=${month}`);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data || {}
        };
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch calendar data',
            data: {}
        };
    }
};