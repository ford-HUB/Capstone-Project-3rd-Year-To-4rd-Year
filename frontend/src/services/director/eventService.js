import { apiInstance } from "../../api/_base.js";

export const getAllEvents = async () => {
    try {
        const response = await apiInstance.get('/api/event/list-event');
        return {
            success: response.data.success,
            message: response.data.message,
            events: response.data.list || []
        };
    } catch (error) {
        console.error('[Director Service] Get all events failed:', error);
        throw error;
    }
}

export const registerEventDirector = async (event_id) => {
    const response = await apiInstance.post(`/api/director-event/register-event/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const unRegisterEventDirector = async (event_id) => {
    const response = await apiInstance.delete(`/api/director-event/unregister-event/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}