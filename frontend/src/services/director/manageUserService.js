import { apiInstance } from "../../api/_base.js";

export const getListUsers = async () => {
    const response = await apiInstance.get('/api/director-manage-user/list-users')
    return {
        success: response.data.success,
        list: response.data.list,
        message: response.data.message
    }
}

export const softDeleteUser = async (id, reason) => {
    console.log('Soft deleting user with ID:', id)
    const response = await apiInstance.delete(`/api/director-manage-user/delete-user/${id}`, { data: { reason } })
    console.log('Soft delete response:', response.data)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const deactivateUser = async (id, reason) => {
    const response = await apiInstance.put(`/api/director-manage-user/account/${id}/deactivate`, { reason })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const restoreUser = async (id) => {
    const response = await apiInstance.put(`/api/director-manage-user/account/${id}/restore`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getSoftDeletedUsers = async () => {
    const response = await apiInstance.get('/api/director-manage-user/trash')
    return {
        success: response.data.success,
        list: response.data.list,
        message: response.data.message
    }
}

export const restoreSoftDeletedUser = async (id) => {
    const response = await apiInstance.put(`/api/director-manage-user/trash/${id}/restore`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getActiveUsersCount = async () => {
    const response = await apiInstance.get('/api/director-manage-user/active-users')
    return {
        success: response.data.success,
        activeCount: response.data.activeCount,
        activeUsers: response.data.activeUsers,
        message: response.data.message
    }
}

export const updateUserActivity = async () => {
    const response = await apiInstance.put('/api/director-manage-user/update-activity')
    return {
        success: response.data.success,
        message: response.data.message
    }
}