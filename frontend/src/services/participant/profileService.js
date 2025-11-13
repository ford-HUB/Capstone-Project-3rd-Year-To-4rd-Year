import { apiInstance } from "../../api/_base.js";

export const currentUserProfile = async () => {
    const response = await apiInstance.get('/api/profile/current-profile')
    return {
        success: response.data.success,
        profile: response.data.profileData[0]
    }
}

export const updateUserProfile = async (formData) => {
    const response = await apiInstance.put('/api/profile/update-profile', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const updateAccountEmail = async (formData) => {
    const response = await apiInstance.put('/api/profile/update-account-email', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}

export const undoEmailChanges = async () => {
    const response = await apiInstance.put('/api/profile/undo-email-changes')
    return {
        success: response.data.success
    }
}