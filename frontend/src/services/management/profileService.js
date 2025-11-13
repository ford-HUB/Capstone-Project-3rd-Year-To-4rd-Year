import { apiInstance } from "../../api/_base.js";

export const getCurrentProfile = async () => {
    const response = await apiInstance.get('/api/management-profile/current-profile')
    return {
        success: response.data.success,
        message: response.data.message,
        profileInfo: response.data.info
    }
}

export const insertPersonInfo = async (formData) => {
    const response = await apiInstance.post('/api/management-profile/add-profile', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const insertPersonAddress = async (formData) => {
    const response = await apiInstance.post('/api/management-profile/add-address', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateEmailAvatar = async (formData) => {
    const response = await apiInstance.put('/api/management-profile/update-email-avatar', formData, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    })

    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updatePasswordUser = async (newPassword) => {
    const response = await apiInstance.put('/api/management-profile/update-password', newPassword)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateSignature = async (formData) => {
    const response = await apiInstance.put('/api/management-profile/update-signature', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return {
        success: response.data.success,
        message: response.data.message
    }
}