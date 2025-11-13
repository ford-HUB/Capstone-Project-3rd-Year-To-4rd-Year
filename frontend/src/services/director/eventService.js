import { apiInstance } from "../../api/_base.js";

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