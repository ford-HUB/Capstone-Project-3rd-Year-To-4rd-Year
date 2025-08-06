import { apiInstance } from "../../api/_base.js"

export const requestApprovalUser = async (email) => {
    const response = await apiInstance.post('/api/staff-auth/request-approval', email)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const verifyStaffToken = async (token) => {
    const response = await apiInstance.get(`/api/staff-auth/check-authenticated-token/${token}`)
    return {
        success: response.data.success,
        email: response.data.email,
        message: response.data.message,
        expiredToken: response.data.expiredToken,
        yourToken: response.data.yourToken
    }
}

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/staff-auth/staff-login', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const signupUser = async (token, formData) => {
    const response = await apiInstance.post(`/api/staff-auth/staff-signup/${token}`, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const currentUser = async () => {
    const response = await apiInstance.get('/api/staff-auth/check-auth-staff')
    return {
        success: response.data.success,
        user: response.data.user
    }
}