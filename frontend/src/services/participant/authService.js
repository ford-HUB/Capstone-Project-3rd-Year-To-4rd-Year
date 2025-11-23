import { apiInstance } from "../../api/_base.js"

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/user-auth/user-login', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        role: response.data.role,
        userId: response.data.userId
    }
}

export const signupUser = async (formData) => {
    try {
        const response = await apiInstance.post('/api/user-auth/user-signup', formData)

        return {
            success: response.data.success,
            message: response.data.message,
            otp_expiration: response.data.otp_expiration,
            user: response.data.user
        }
    } catch (error) {
        console.error('Signup API error:', error)
        throw error
    }
}


export const logoutUser = async () => {
    const response = await apiInstance.post('/api/user-auth/logout')
    return {
        success: response.data.success,
        message: response.data.message,
        userId: response.data.userId
    }
}

export const currentUser = async () => {
    try {
        const response = await apiInstance.get('/api/user-auth/checkAuth')
        return {
            success: response.data.success,
            user: response.data.user
        }
    } catch (error) {
        console.error('currentUser API error:', error.response?.data || error.message);
        return {
            success: false,
            user: null,
            message: error.response?.data?.message || 'Failed to authenticate'
        }
    }
}

export const checkEmailExists = async (email) => {
    const response = await apiInstance.post('/api/user-auth/check-email', { email })
    return {
        success: response.data.success,
        exists: response.data.exists,
        message: response.data.message,
        canReuse: response.data.canReuse || false
    }
}

export const changeParticipantPassword = async (passwordData) => {
    const response = await apiInstance.put('/api/profile/change-password', passwordData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await apiInstance.post('/api/user-auth/forgot-password', { email })
        return {
            success: response.data.success,
            message: response.data.message,
            resetToken: response.data.resetToken
        }
    } catch (error) {
        console.error('Forgot password API error:', error)
        throw error
    }
}

export const resetPassword = async (resetData) => {
    try {
        const response = await apiInstance.post('/api/user-auth/reset-password', resetData)
        return {
            success: response.data.success,
            message: response.data.message
        }
    } catch (error) {
        console.error('Reset password API error:', error)
        throw error
    }
}

export const checkEmailForPasswordReset = async (email) => {
    try {
        const response = await apiInstance.post('/api/user-auth/check-email', { email })
        return {
            success: response.data.success,
            exists: response.data.exists,
            account: response.data.account,
            message: response.data.message
        }
    } catch (error) {
        console.error('Check email API error:', error)
        throw error
    }
}