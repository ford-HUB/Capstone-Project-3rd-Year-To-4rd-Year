import { apiInstance } from "../../api/_base.js"

export const requestApprovalUser = async (formData) => {
    const response = await apiInstance.post('/api/management-auth/request-approval', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const verifyToken = async (token) => {
    const response = await apiInstance.get(`/api/management-auth/check-authenticated-token?token=${token}`)
    return {
        success: response.data.success,
        role: response.data.role,
        message: response.data.message,
        expiredToken: response.data.expiredToken,
        yourToken: response.data.yourToken
    }
}

export const setAccount = async (formData, token) => {
    const response = await apiInstance.post(`/api/management-auth/set-up-account?token=${token}`, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/management-auth/management-login', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const logoutUser = async () => {
    const response = await apiInstance.post('/api/management-auth/management-logout')
    return {
        success: response.data.success,
        message: response.data.message
    }
}


export const currentUser = async () => {
    const response = await apiInstance.get('/api/management-auth/check-auth-management')
    return {
        success: response.data.success,
        user: response.data.user
    }
}