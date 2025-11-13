import { apiInstance } from "../../api/_base.js";

export const currentEvents = async () => {
    const response = await apiInstance.get('/api/event/list-event')
    return {
        success: response.data.success,
        message: response.data.message,
        eventList: response.data.list
    }
}

export const insertEvent = async (formData) => {
    const response = await apiInstance.post('/api/event/add-event', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateEventById = async (id, formData) => {
    const response = await apiInstance.put(`/api/event/update-event/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const deleteEvent = async (id) => {
    const response = await apiInstance.delete(`/api/event/delete-event/${id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getParticipants = async (event_id) => {
    const response = await apiInstance.get(`/api/event/get-participants/${event_id}`)
    return {
        success: response.data.success,
        list: response.data.participants
    }
}

export const getParticipantRegisterStatus = async (event_id) => {
    const response = await apiInstance.get(`/api/event/get-event-user-status/${event_id}`)
    return response.data.status
}

export const getParticipantCount = async (event_id) => {
    const response = await apiInstance.get(`/api/event/get-event-participant-count/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message,
        registeredParticipant: response.data.count
    }
}

export const removeEventRegistration = async (registration_id, reason) => {
    const response = await apiInstance.delete(`/api/event/remove-registration/${registration_id}`, {
        data: { reason }
    })
    return {
        success: response.data.success,
        message: response.data.message
    }
}