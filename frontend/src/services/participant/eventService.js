import { apiInstance } from "../../api/_base.js"

export const currentInterest = async () => {
    const response = await apiInstance.get('/api/profile/check-interest')
    return {
        success: response.data.success,
        hasInterest: response.data.hasInterest,
        interest: response.data.interest
    }
}

export const createInterestUser = async (list) => {
    const response = await apiInstance.post('/api/profile/add-interest', { interest: list })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateInterest = async (updatedList) => {
    const response = await apiInstance.put('/api/profile/update-interest', { interest: updatedList })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const matchedEvent = async () => {
    const response = await apiInstance.get('/api/ai/matched-events')
    return {
        success: response.data.success,
        events: response.data.events,
        recommendations: response.data.recommendations,
        volunteerId: response.data.volunteerId
    }
}

export const registerEvent = async (eventId, formData) => {
    const response = await apiInstance.post(`/api/participate/register-event/${eventId}`, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const eventRegistration = async (event_id, formData) => {
    const response = await apiInstance.post(`/api/participate/event-registration/${event_id}`, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const eventCancelledRegistration = async (event_id) => {
    const response = await apiInstance.delete(`/api/participate/event-cancellation/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getAllRegisteredEvent = async (page, limit) => {
    const response = await apiInstance.get(`/api/participate/get-all-registered-events?page=${page}&limit=${limit}`)
    return {
        success: response.data.success,
        records: response.data.data,
        pagination: {
            totalRecords: response.data.pagination.totalRecords,
            totalPages: response.data.pagination.totalPages,
            currentPage: response.data.pagination.currentPage,
            pageSize: response.data.pagination.pageSize
        }
    }
}

export const getAllEventData = async () => {
    const response = await apiInstance.get('/api/participate/event-calendar')
    return {
        success: response.data.success,
        eventData: response.data.eventData
    }
}

export const getParticipationHistory = async (page, limit) => {
    const response = await apiInstance.get(`/api/participate/participation-history?page=${page}&limit=${limit}`)
    return {
        success: response.data.success,
        data: response.data.data,
        summary: response.data.summary,
        pagination: {
            totalRecords: response.data.pagination.totalRecords,
            totalPages: response.data.pagination.totalPages,
            currentPage: response.data.pagination.currentPage,
            pageSize: response.data.pagination.pageSize
        }
    }
}
