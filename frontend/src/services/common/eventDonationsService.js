import { apiInstance } from '../../api/_base.js';

// Get event donations
export const getEventDonations = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.status && filters.status !== 'all') {
            params.append('status', filters.status);
        }
        if (filters.type && filters.type !== 'all') {
            params.append('type', filters.type);
        }
        if (filters.dateRange && filters.dateRange !== 'all') {
            params.append('dateRange', filters.dateRange);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }

        const response = await apiInstance.get(`/api/event-donations/list?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('getEventDonations service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch event donations'
        };
    }
};

// Get event donation statistics
export const getEventDonationStats = async () => {
    try {
        const response = await apiInstance.get('/api/event-donations/stats');
        return response.data;
    } catch (error) {
        console.error('getEventDonationStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch event donation statistics'
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
        link.setAttribute('download', `event-donations-export-${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Event donations exported successfully' };
    } catch (error) {
        console.error('exportDonations service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to export donations'
        };
    }
};
