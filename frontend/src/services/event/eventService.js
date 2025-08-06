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