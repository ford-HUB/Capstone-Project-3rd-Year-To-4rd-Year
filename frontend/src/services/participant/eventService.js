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
        events: response.data.matched
    }
}

export const registerEvent = async (eventId, formData) => {
    const response = await apiInstance.post(`/api/participate/register-event/${eventId}`, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}