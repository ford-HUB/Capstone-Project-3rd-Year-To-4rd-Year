import { apiInstance } from "../../api/_base.js";

export const registerManagementEvent = async (event_id) => {
    const response = await apiInstance.post(`/api/management-event/register-event/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const unRegisterEventManagement = async (event_id) => {
    const response = await apiInstance.delete(`/api/management-event/unregister-event/${event_id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}