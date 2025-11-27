import { apiInstance } from "../../api/_base.js";

export const getAllPendingRegistrations = async () => {
    console.log('[Director Service] Making API call to get pending registrations...');
    const response = await apiInstance.get('/api/director/manage-beneficiary/beneficiary-requests')
    console.log('[Director Service] API response:', response.data);
    return {
        success: response.data.success,
        message: response.data.message,
        registrations: response.data.registrations
    }
}

export const approveRegistration = async (registrationId) => {
    const response = await apiInstance.post(`/api/director/manage-beneficiary/beneficiary-requests/${registrationId}/approve`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const declineRegistration = async (registrationId, reason) => {
    const response = await apiInstance.post(`/api/director/manage-beneficiary/beneficiary-requests/${registrationId}/decline`, {
        reason: reason
    })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

/**
 * Get beneficiary records with registration and attendance information
 * @param {string} eventId - Optional event ID to filter by
 * @param {string} status - Optional status to filter by ('registered', 'pending', 'declined', 'all')
 * @returns {Promise<Object>} Response with records array
 */
export const getBeneficiaryRecords = async (eventId = null, status = null) => {
    try {
        let url = '/api/director/manage-beneficiary/beneficiary-records';
        const params = [];
        
        if (eventId) {
            params.push(`event_id=${eventId}`);
        }
        if (status && status !== 'all') {
            params.push(`status=${status}`);
        }
        
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        
        const response = await apiInstance.get(url);
        return {
            success: response.data.success,
            message: response.data.message,
            records: response.data.records || [],
            count: response.data.count || 0
        };
    } catch (error) {
        console.error('[Director Service] Get beneficiary records failed:', error);
        throw error;
    }
}