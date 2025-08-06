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


export const deleteUser = async (id) => {
    const response = await apiInstance.delete(`/api/director-manage/delete-request/${id}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}


