import { apiInstance } from "../../api/_base.js"

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/user-auth/user-login', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        role: response.data.role
    }
}

export const signupUser = async (formData) => {
    const response = await apiInstance.post('/api/user-auth/user-signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })

    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}

export const logoutUser = async () => {
    const response = await apiInstance.post('/api/user-auth/user-logout')
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const currentUser = async () => {
    const response = await apiInstance.get('/api/user-auth/checkAuth')
    return {
        success: response.data.success,
        user: response.data.user
    }
}