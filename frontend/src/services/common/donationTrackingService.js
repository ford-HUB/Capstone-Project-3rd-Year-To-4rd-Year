import { apiInstance } from '../../api/_base.js';

// Get donation list with filters
export const getDonationList = async (params = {}) => {
    try {
        const { page = 1, limit = 10, status, type, dateRange, search, event, month, year } = params;
        const queryParams = new URLSearchParams();
        
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (status && status !== 'all') queryParams.append('status', status);
        if (type && type !== 'all') queryParams.append('type', type);
        if (dateRange && dateRange !== 'all') queryParams.append('dateRange', dateRange);
        if (search) queryParams.append('search', search);
        if (event && event !== 'all') queryParams.append('event', event);
        if (month !== undefined && month !== null && month !== 'all') queryParams.append('month', month);
        if (year !== undefined && year !== null && year !== 'all') queryParams.append('year', year);
        
        const response = await apiInstance.get(`/api/event-donations/list?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('getDonationList service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch donations'
        };
    }
};

// Get donation statistics
export const getDonationStats = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.month !== undefined && filters.month !== null && filters.month !== 'all') {
            params.append('month', filters.month);
        }
        if (filters.year !== undefined && filters.year !== null && filters.year !== 'all') {
            params.append('year', filters.year);
        }
        
        const queryString = params.toString();
        const url = `/api/event-donations/stats${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('getDonationStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch donation statistics'
        };
    }
};

// Get events open for donations
export const getOpenDonationEvents = async () => {
    try {
        const response = await apiInstance.get('/api/event-donations/open-events');
        return response.data;
    } catch (error) {
        console.error('getOpenDonationEvents service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch open donation events'
        };
    }
};

// Get dashboard statistics
export const getDashboardStats = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.month !== undefined && filters.month !== null && filters.month !== 'all') {
            params.append('month', filters.month);
        }
        if (filters.year !== undefined && filters.year !== null && filters.year !== 'all') {
            params.append('year', filters.year);
        }
        if (filters.event && filters.event !== 'all') {
            params.append('event', filters.event);
        }
        
        const response = await apiInstance.get(`/api/event-donations/dashboard?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('getDashboardStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
        };
    }
};

// Bulk update donation status
export const bulkUpdateDonationStatus = async (donationIds, status) => {
    try {
        const response = await apiInstance.put('/api/event-donations/bulk-status', {
            donationIds,
            status
        });
        return response.data;
    } catch (error) {
        console.error('bulkUpdateDonationStatus service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to bulk update donation status'
        };
    }
};

// Update donation status
export const updateDonationStatus = async (donationId, newStatus) => {
    try {
        const response = await apiInstance.put(`/api/event-donations/${donationId}/status`, {
            status: newStatus
        });
        return response.data;
    } catch (error) {
        console.error('updateDonationStatus service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update donation status'
        };
    }
};

// Export donations
export const exportDonations = async (selectedDonations = []) => {
    try {
        const response = await apiInstance.post('/api/event-donations/export', {
            donationIds: selectedDonations
        }, {
            responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `donations-export-${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Donations exported successfully' };
    } catch (error) {
        console.error('exportDonations service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to export donations'
        };
    }
};

// Get donation details
export const getDonationDetails = async (donationId) => {
    try {
        const response = await apiInstance.get(`/api/event-donations/${donationId}`);
        return response.data;
    } catch (error) {
        console.error('getDonationDetails service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch donation details'
        };
    }
};

// Get authenticated donor's own donations
export const getDonorTracking = async () => {
    try {
        const response = await apiInstance.get(`/api/donation/my`);
        return response.data;
    } catch (error) {
        console.error('getDonorTracking service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch my donations'
        };
    }
};

// Get authenticated donor's donation history (completed donations)
export const getDonorDonationHistory = async () => {
    try {
        const response = await apiInstance.get(`/api/donation/my/history`);
        return response.data;
    } catch (error) {
        console.error('getDonorDonationHistory service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch donation history'
        };
    }
};

// Public: Get donation by ID for donor tracking view
export const getDonationPublicDetails = async (donationId) => {
    try {
        const response = await apiInstance.get(`/api/donation/${donationId}`);
        return response.data;
    } catch (error) {
        console.error('getDonationPublicDetails failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch donation details'
        };
    }
};
