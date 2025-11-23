import { apiInstance } from '../../api/_base.js';

// Get all documents as submissions with approval status
export const getAllDocumentsAsSubmissions = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.department_id) queryParams.append('department_id', filters.department_id);
        if (filters.submission_type) queryParams.append('submission_type', filters.submission_type);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.submitted_by) queryParams.append('submitted_by', filters.submitted_by);
        if (filters.month) queryParams.append('month', filters.month);
        
        const url = queryParams.toString() 
            ? `/api/submissions/all-documents?${queryParams.toString()}`
            : '/api/submissions/all-documents';
            
        const response = await apiInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching documents as submissions:', error);
        throw error;
    }
};

// Get submissions (alias for getAllDocumentsAsSubmissions)
export const getSubmissions = async (filters = {}) => {
    return getAllDocumentsAsSubmissions(filters);
};

// Get submissions with filters (alias for getAllDocumentsAsSubmissions)
export const getSubmissionsWithFilters = async (filters = {}) => {
    return getAllDocumentsAsSubmissions(filters);
};

// Create a new submission
export const createSubmission = async (submissionData) => {
    try {
        const response = await apiInstance.post('/api/submissions', submissionData);
        return response.data;
    } catch (error) {
        console.error('Error creating submission:', error);
        throw error;
    }
};

// Get submission by ID
export const getSubmissionById = async (id) => {
    try {
        const response = await apiInstance.get(`/api/submissions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching submission by ID:', error);
        throw error;
    }
};

// Update a submission
export const updateSubmission = async (id, submissionData) => {
    try {
        const response = await apiInstance.put(`/api/submissions/${id}`, submissionData);
        return response.data;
    } catch (error) {
        console.error('Error updating submission:', error);
        throw error;
    }
};

// Delete a submission
export const deleteSubmission = async (id) => {
    try {
        const response = await apiInstance.delete(`/api/submissions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
};