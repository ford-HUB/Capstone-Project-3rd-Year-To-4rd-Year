import { apiInstance } from "../../api/_base.js"

export const loginUser = async (formData) => {
    const response = await apiInstance.post('/api/donor-auth/donor-login', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        role: 'Donor',
        userId: response.data.userId
    }
}

export const signupUser = async (formData) => {
    const response = await apiInstance.post('/api/donor-auth/donor-signup', formData)
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}

export const logoutUser = async () => {
    const response = await apiInstance.post('/api/donor-auth/donor-logout')
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const currentUser = async () => {
    try {
        // Token is automatically added by axios interceptor from localStorage
        const response = await apiInstance.get('/api/donor-auth/checkAuth')
        return {
            success: response.data.success,
            user: response.data.user
        }
    } catch (error) {
        return { success: false, user: null }
    }
}

export const verifyCode = async (code) => {
    const response = await apiInstance.post('/api/donor-auth/verify-code', { code })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const resendCode = async () => {
    const response = await apiInstance.post('/api/donor-auth/resend-verification-code')
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}

// Forgot password functionality
export const forgotPassword = async (email) => {
    try {
        const response = await apiInstance.post('/api/donor-auth/forgot-password', { email });
        return {
            success: response.data.success,
            message: response.data.message,
            resetToken: response.data.resetToken
        };
    } catch (error) {
        console.error('[Donor Auth Service] Forgot password error:', error);
        throw error;
    }
};

// Reset password functionality
export const resetPassword = async (resetData) => {
    try {
        const response = await apiInstance.post('/api/donor-auth/reset-password', resetData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Donor Auth Service] Reset password error:', error);
        throw error;
    }
};

// Check email for password reset
export const checkEmailForPasswordReset = async (email) => {
    try {
        const response = await apiInstance.post('/api/donor-auth/check-email', { email });
        return {
            success: response.data.success,
            exists: response.data.exists,
            isOAuth: response.data.isOAuth || false,
            account: response.data.account,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Donor Auth Service] Check email error:', error);
        throw error;
    }
};