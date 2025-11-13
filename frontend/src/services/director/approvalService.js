import { apiInstance } from "../../api/_base.js"

export const currentRequestList = async () => {
    const response = await apiInstance.get('/api/director-manage/list-request-approvals')
    return {
        success: response.data.success,
        requests: response.data.list
    }
}

export const approveUser = async (id) => {
    const response = await apiInstance.put(`/api/director-manage/set-approved-request/${id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const rejectUser = async (id, reason) => {
    const response = await apiInstance.put(`/api/director-manage/reject-request/${id}`, { reason })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getRejectedRequests = async () => {
    const response = await apiInstance.get('/api/director-manage/list-rejected-requests')
    return {
        success: response.data.success,
        requests: response.data.list
    }
}

export const acceptRejectedRequest = async (id) => {
    const response = await apiInstance.put(`/api/director-manage/accept-rejected-request/${id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}



