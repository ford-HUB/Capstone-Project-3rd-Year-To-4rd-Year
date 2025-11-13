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