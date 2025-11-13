import { apiInstance } from "../../api/_base.js";

// Get location-based matched events for beneficiary
export const getBeneficiaryMatchedEvents = async () => {
    try {
        const response = await apiInstance.get('/api/beneficiary-events/matched-events');
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary matched events:', error);
        throw error;
    }
};

// Register beneficiary for an event
export const registerBeneficiaryForEvent = async (eventId, formData) => {
    try {
        // Don't set Content-Type header - let the browser set it automatically for FormData
        const response = await apiInstance.post(`/api/beneficiary-events/register/${eventId}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error registering for event:', error);
        throw error;
    }
};

// Cancel beneficiary event registration
export const cancelBeneficiaryRegistration = async (eventId) => {
    try {
        const response = await apiInstance.delete(`/api/beneficiary-events/cancel/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling registration:', error);
        throw error;
    }
};

// Get all registered events for beneficiary
export const getBeneficiaryRegisteredEvents = async (page = 1, limit = 5) => {
    try {
        console.log('Service: Fetching registered events...', { page, limit });
        const response = await apiInstance.get(`/api/beneficiary-events/registered-events?page=${page}&limit=${limit}`);
        console.log('Service: Registered events response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Service: Error fetching registered events:', error);
        throw error;
    }
};

// Get pending registrations for beneficiary
export const getBeneficiaryPendingRegistrations = async (page = 1, limit = 5) => {
    try {
        console.log('Service: Fetching pending registrations...', { page, limit });
        const response = await apiInstance.get(`/api/beneficiary-events/pending-registrations?page=${page}&limit=${limit}`);
        console.log('Service: Pending registrations response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Service: Error fetching pending registrations:', error);
        throw error;
    }
};

// Get beneficiary attendance records
export const getBeneficiaryAttendanceRecords = async (page = 1, limit = 10, month = null, year = null) => {
    try {
        console.log('Service: Fetching attendance records...', { page, limit, month, year });
        let url = `/api/beneficiary-events/attendance-records?page=${page}&limit=${limit}`;
        
        if (month) url += `&month=${month}`;
        if (year) url += `&year=${year}`;
        
        const response = await apiInstance.get(url);
        console.log('Service: Attendance records response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Service: Error fetching attendance records:', error);
        throw error;
    }
};

// Get beneficiary completed + registered attendance records
export const getBeneficiaryCompletedAttendanceRecords = async (page = 1, limit = 10, month = null, year = null) => {
    try {
        console.log('Service: Fetching completed attendance records...', { page, limit, month, year });
        let url = `/api/beneficiary-events/completed-attendance-records?page=${page}&limit=${limit}`;

        if (month) url += `&month=${month}`;
        if (year) url += `&year=${year}`;

        const response = await apiInstance.get(url);
        console.log('Service: Completed attendance records response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Service: Error fetching completed attendance records:', error);
        throw error;
    }
};

// Test registered events filter
export const testRegisteredEventsFilter = async () => {
    try {
        const response = await apiInstance.get('/api/beneficiary-events/test-registered-filter');
        return response.data;
    } catch (error) {
        console.error('Error testing registered events filter:', error);
        throw error;
    }
};

// Refresh beneficiary location-based matches
export const refreshBeneficiaryMatches = async () => {
    try {
        const response = await apiInstance.post('/api/beneficiary-events/refresh-matches');
        return response.data;
    } catch (error) {
        console.error('Error refreshing matches:', error);
        throw error;
    }
};

export const getBeneficiaryParticipationHistory = async (page = 1, limit = 10) => {
    try {
        const response = await apiInstance.get(`/api/beneficiary-events/participation-history?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Service: Error fetching beneficiary participation history:', error);
        throw error;
    }
};
