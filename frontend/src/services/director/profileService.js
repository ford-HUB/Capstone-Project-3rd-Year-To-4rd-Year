import { apiInstance } from "../../api/_base.js";

export const currentProfile = async () => {
    const response = await apiInstance.get('/api/director-profile/get-current-profile')
    return {
        success: response.data.success,
        directorInfo: response.data.directorInfo,
        paymentInfo: response.data.paymentInfo
    }
}

export const insertPersonalInfo = async (formData) => {
    const response = await apiInstance.post('/api/director-profile/add-director-info', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const insertAddress = async (formData) => {
    const response = await apiInstance.post('/api/director-profile/add-director-address', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateSigningEmail = async (formData) => {
    const response = await apiInstance.put('/api/director-profile/update-director-signing-email', formData, {
        'Content-Type': 'multipart/form-data',
    })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updatePassword = async (formData) => {
    const response = await apiInstance.put('/api/director-profile/update-director-password', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}