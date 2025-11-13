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

// Forgot password functionality
export const forgotPassword = async (email) => {
    try {
        const response = await apiInstance.post('/api/user-auth/forgot-password', { email })
        return {
            success: response.data.success,
            message: response.data.message
        }
    } catch (error) {
        console.error('[Director Auth Service] Forgot password error:', error)
        throw error
    }
}

// Reset password functionality
export const resetPassword = async (resetData) => {
    try {
        const response = await apiInstance.post('/api/user-auth/reset-password', resetData)
        return {
            success: response.data.success,
            message: response.data.message
        }
    } catch (error) {
        console.error('[Director Auth Service] Reset password error:', error)
        throw error
    }
}

// Check email for password reset
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
        console.error('[Director Auth Service] Check email error:', error)
        throw error
    }
}