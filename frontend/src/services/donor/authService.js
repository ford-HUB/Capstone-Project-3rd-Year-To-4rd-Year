import { apiInstance } from "../../api/_base.js"

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/donor-auth/donor-login', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const signupUser = async (formData) => {
    const response = await apiInstance.post('/api/donor-auth/donor-login', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}

export const currentUser = async () => {
    const response = await apiInstance.get('/api/donor-auth/checkAuth')
    return {
        success: response.data.success,
        user: response.data.user
    }
}