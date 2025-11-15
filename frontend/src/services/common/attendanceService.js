import { apiInstance } from "../../api/_base.js";

export const ScanQrAttendance = async (decodedLink) => {
    try {
        // Ensure the decodedLink is a valid path (starts with /)
        const url = decodedLink.startsWith('/') ? decodedLink : `/${decodedLink}`;
        
        // apiInstance already has withCredentials: true set globally
        const response = await apiInstance.get(url)
        return {
            success: response.data.success,
            message: response.data.message,
            eventDetails: response.data.eventDetails
        }
    } catch (error) {
        // Handle 401 Unauthorized - user needs to re-authenticate
        if (error.response?.status === 401) {
            return {
                success: false,
                message: 'Your session has expired. Please log in again.',
                eventDetails: null,
                requiresAuth: true
            }
        }
        
        // Extract error message from backend response if available
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Failed to scan QR code';
        return {
            success: false,
            message: errorMessage,
            eventDetails: null
        }
    }
}

export const getListAttendanceParticipantLog = async () => {
    try {
        const response = await apiInstance.get('/api/attendance/attendance-log')
        return {
            success: response.data.success,
            attendanceData: response.data.attendanceData
        }
    } catch (error) {
        console.error('Error fetching attendance log:', error);
        return {
            success: false,
            attendanceData: []
        }
    }
}

export const getAllAttendanceRecords = async (page, limit, filters = {}) => {
    try {
        const { 
            participant_type, 
            event_id, 
            status, 
            date_from, 
            date_to,
            event_status,
            search_term,
            department
        } = filters;

        let url = `/api/attendance/attendance-records?page=${page}&limit=${limit}`;
        
        if (participant_type) url += `&participant_type=${participant_type}`;
        if (event_id) url += `&event_id=${event_id}`;
        if (status) url += `&status=${status}`;
        if (date_from) url += `&date_from=${date_from}`;
        if (date_to) url += `&date_to=${date_to}`;
        if (event_status) url += `&event_status=${event_status}`;
        if (search_term) url += `&search_term=${encodeURIComponent(search_term)}`;
        if (department) url += `&department=${department}`;

        const response = await apiInstance.get(url)
        
        return {
            success: response.data.success || false,
            attendanceData: response.data.attendanceData || [],
            pagination: {
                total: response.data.pagination?.total || 0,
                page: response.data.pagination?.page || page,
                totalPages: response.data.pagination?.totalPages || 0
            },
            statistics: response.data.statistics || {
                participantTypeCounts: [],
                statusCounts: { present_count: 0, in_progress_count: 0 },
                totalRecords: 0
            }
        }
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return {
            success: false,
            attendanceData: [],
            pagination: {
                total: 0,
                page: page,
                totalPages: 0
            },
            statistics: {
                participantTypeCounts: [],
                statusCounts: { present_count: 0, in_progress_count: 0 },
                totalRecords: 0
            }
        }
    }
}

