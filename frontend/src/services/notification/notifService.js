import { apiInstance } from "../../api/_base.js";

export const getNotifications = async (page = 1, limit = 10) => {
    const response = await apiInstance.get(`/api/notification/list?page=${page}&limit=${limit}`);
        return {
            success: response.data.success,
            notifications: response.data.list,
            pagination: response.data.pagination
        };
}

export const markNotificationAsRead = async (notificationId) => {
    const response = await apiInstance.put(`/api/notification/mark-as-read/${notificationId}`);
    return {
        success: response.data.success,
        message: response.data.message
    };
}