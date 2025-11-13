import { apiInstance } from "../../api/_base.js"

export const getDonorProfile = async () => {
    const response = await apiInstance.get('/api/donor/profile')
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    }
}

export const updateDonorProfile = async (profileData) => {
    const response = await apiInstance.put('/api/donor/profile', profileData)
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    }
}

export const changePassword = async (passwordData) => {
    const response = await apiInstance.put('/api/donor/change-password', passwordData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getDonorStats = async () => {
    const response = await apiInstance.get('/api/donor/stats')
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    }
}
