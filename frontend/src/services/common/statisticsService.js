import { apiInstance } from '../../api/_base.js';

/**
 * Get comprehensive statistics for director dashboard
 * @param {Object} filters - Optional filters { month, year }
 */
export const getComprehensiveStats = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.month !== undefined && filters.month !== null && filters.month !== 'all') {
            params.append('month', filters.month);
        }
        if (filters.year !== undefined && filters.year !== null && filters.year !== 'all') {
            params.append('year', filters.year);
        }
        
        const queryString = params.toString();
        const url = `/api/director/statistics/comprehensive${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('getComprehensiveStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch comprehensive statistics'
        };
    }
};

/**
 * Get overview statistics for authenticated users
 * Provides general system overview without sensitive data
 */
export const getOverviewStats = async () => {
    try {
        const url = `/api/director/statistics/overview`;
        
        const response = await apiInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('getOverviewStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch overview statistics'
        };
    }
};

