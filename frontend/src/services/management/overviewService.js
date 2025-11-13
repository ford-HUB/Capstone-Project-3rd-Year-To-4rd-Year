import { apiInstance } from "../../api/_base.js";

/**
 * Get department overview for coordinator and assistant coordinator
 */
export const getDepartmentOverview = async () => {
    try {
        const response = await apiInstance.get('/api/management/department-overview');
        console.log('Overview service response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getDepartmentOverview service failed:', error);
        console.error('Error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch department overview',
            data: null
        };
    }
};

/**
 * Get staff overview (system-wide statistics)
 */
export const getStaffOverview = async () => {
    try {
        const response = await apiInstance.get('/api/management/staff-overview');
        console.log('Staff overview service response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getStaffOverview service failed:', error);
        console.error('Error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch staff overview',
            data: null
        };
    }
};

