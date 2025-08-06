import { apiInstance } from "../../api/_base.js"

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/director-auth/uclm-director-login', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const logoutUser = async () => {
    const response = await apiInstance.post('/api/director-auth/uclm-director-logout')
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const currentUser = async () => {
    const response = await apiInstance.get('/api/director-auth/check-director-auth')
    return {
        success: response.data.success,
        user: response.data.user
    }
}