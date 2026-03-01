import { apiInstance } from "../../api/_base.js";

// Beneficiary login
export const beneficiaryLogin = async (formData) => {
    try {
        console.log('[Beneficiary Auth Service] Making login request...');
        const response = await apiInstance.post('/api/user-auth/user-login', formData);
        console.log('[Beneficiary Auth Service] Login response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message,
            role: response.data.role,
            userId: response.data.userId
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Login error:', error);
        throw error;
    }
};

// Beneficiary logout
export const beneficiaryLogout = async () => {
    try {
        console.log('[Beneficiary Auth Service] Making logout request...');
        const response = await apiInstance.post('/api/user-auth/logout');
        console.log('[Beneficiary Auth Service] Logout response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message,
            userId: response.data.userId
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Logout error:', error);
        throw error;
    }
};

// Get beneficiary auth status
export const getBeneficiaryAuthStatus = async () => {
    try {
        console.log('[Beneficiary Auth Service] Checking auth status...');
        const response = await apiInstance.get('/api/user-auth/checkAuth');
        console.log('[Beneficiary Auth Service] Auth status response:', response.data);
        return {
            success: response.data.success,
            user: response.data.user
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Auth status error:', error);
        throw error;
    }
};

// Change beneficiary password
export const changeBeneficiaryPassword = async (passwordData) => {
    try {
        console.log('[Beneficiary Auth Service] Making API call to change password...');
        const response = await apiInstance.put('/api/beneficiary/profile/change-password', passwordData);
        console.log('[Beneficiary Auth Service] Password change response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Error changing password:', error);
        throw error;
    }
};

// Verify current password (for additional security)
export const verifyCurrentPassword = async (currentPassword) => {
    try {
        console.log('[Beneficiary Auth Service] Verifying current password...');
        const response = await apiInstance.post('/api/beneficiary/profile/verify-password', {
            currentPassword
        });
        console.log('[Beneficiary Auth Service] Password verification response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Error verifying password:', error);
        throw error;
    }
};

// Forgot password functionality
export const forgotPassword = async (email) => {
    try {
        console.log('[Beneficiary Auth Service] Making forgot password request...');
        const response = await apiInstance.post('/api/user-auth/forgot-password', { email });
        console.log('[Beneficiary Auth Service] Forgot password response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message,
            resetToken: response.data.resetToken
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Forgot password error:', error);
        throw error;
    }
};

// Reset password functionality
export const resetPassword = async (resetData) => {
    try {
        console.log('[Beneficiary Auth Service] Making reset password request...');
        const response = await apiInstance.post('/api/user-auth/reset-password', resetData);
        console.log('[Beneficiary Auth Service] Reset password response:', response.data);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Reset password error:', error);
        throw error;
    }
};

// Check email for password reset
export const checkEmailForPasswordReset = async (email) => {
    try {
        console.log('[Beneficiary Auth Service] Checking email for password reset...');
        const response = await apiInstance.post('/api/user-auth/check-email', { email });
        console.log('[Beneficiary Auth Service] Check email response:', response.data);
        return {
            success: response.data.success,
            exists: response.data.exists,
            account: response.data.account,
            isOAuth: response.data.isOAuth || false,
            message: response.data.message
        };
    } catch (error) {
        console.error('[Beneficiary Auth Service] Check email error:', error);
        throw error;
    }
};