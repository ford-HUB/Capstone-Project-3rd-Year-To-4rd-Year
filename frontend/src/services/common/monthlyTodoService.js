import { apiInstance } from '../../api/_base.js';

/**
 * Service for handling MonthlyTodo functionality
 * Separated from general submission service for better maintainability
 */

// Get documents specifically for MonthlyTodo with proper filtering
export const getMonthlyTodoDocuments = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Add any specific filters for monthlyTodo
        if (filters.department_id) queryParams.append('department_id', filters.department_id);
        if (filters.submission_type) queryParams.append('submission_type', filters.submission_type);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.submitted_by) queryParams.append('submitted_by', filters.submitted_by);
        
        const url = queryParams.toString() 
            ? `/api/document/monthly-todo?${queryParams.toString()}`
            : '/api/document/monthly-todo';
            
        const response = await apiInstance.get(url);
        
        if (response.data.success) {
            return {
                success: true,
                data: response.data.data,
                requirements: response.data.requirements || [],
                total: response.data.data.length,
                requirementsCount: response.data.requirementsCount || 0
            };
        } else {
            return {
                success: false,
                message: response.data.message || 'Failed to fetch monthlyTodo documents',
                data: [],
                requirements: []
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Network error occurred',
            data: []
        };
    }
};

// Get monthlyTodo documents with specific role-based filtering
export const getMonthlyTodoDocumentsForRole = async (userRole, filters = {}) => {
    try {
        const response = await getMonthlyTodoDocuments(filters);
        
        if (response.success) {
            // Additional role-based filtering can be applied here if needed
            return response;
        }
        
        return response;
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to fetch monthlyTodo documents',
            data: []
        };
    }
};

// Get monthlyTodo documents with date filtering
export const getMonthlyTodoDocumentsForMonth = async (month, year, filters = {}) => {
    try {
        const response = await getMonthlyTodoDocuments(filters);
        
        if (response.success) {
            // Additional month-based filtering can be applied here if needed
            return response;
        }
        
        return response;
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to fetch monthlyTodo documents',
            data: []
        };
    }
};
