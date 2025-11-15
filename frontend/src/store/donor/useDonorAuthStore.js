import { create } from "zustand"
import toast from "react-hot-toast"
import { useVerificationStore } from "./useVerificationStore.js"
import { loginUser, signupUser, logoutUser, currentUser, verifyCode, resendCode, forgotPassword, resetPassword, checkEmailForPasswordReset } from "../../services/donor/authService.js"

export const useDonorAuthStore = create((set) => ({
    authenticatedUser: null,
    isVerifying: false,

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success){ 
                toast.error(response.message) 
                return false
            }

            toast.success(response.message)
            return { success: true, role: response.role }
        } catch (error) {
            console.log('donor login store failed', error.message)
            return false
        }
    },

    signup: async (formData) => {
        try {
            const { setExpiresAt } = useVerificationStore.getState()
            const response = await signupUser(formData)

            if (!response.success) {
                toast.error(response.message || 'Registration failed')
                return false
            }

            toast.success(response.message);
            await setExpiresAt(response.otp_expiration)
            
            // Set user role for verification page
            localStorage.setItem('userRole', 'Donor')
            
            return true;
            
        } catch (error) {
            console.log('donor signup store failed: ', error)
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
            toast.error(errorMessage)
            return false;
        }
    },

    logout: async () => {
        try {
            const response = await logoutUser()
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            set({ authenticatedUser: null })
            
            // Clear user role
            localStorage.removeItem('userRole')
            
            return true
        } catch (error) {
            console.log('donor logout store failed: ', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { 
                console.log('Unauthorized Access')
                set({ authenticatedUser: null })
                return false 
            }
            set({ authenticatedUser: response.user })
            console.log('Donor authenticated:', response.user)
            return true
        } catch (error) {
            console.log('donor check auth store failed', error.message)
            set({ authenticatedUser: null })
            return false
        }
    },

    verifyCode: async (code) => {
        try {
            set({ isVerifying: true })
            const response = await verifyCode(code)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('donor verify code store failed: ', error.message)
            toast.error('Verification failed. Please try again.')
            return false
        } finally {
            set({ isVerifying: false })
        }
    },

    resendCode: async () => {
        try {
            const { setExpiresAt } = useVerificationStore.getState()
            const response = await resendCode()
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            await setExpiresAt(response.otp_expiration)
            return true
        } catch (error) {
            console.log('donor resend code store failed: ', error.message)
            toast.error('Failed to resend code. Please try again.')
            return false
        }
    },

    // OAuth success handler
    handleOAuthSuccess: async () => {
        try {
            console.log('handleOAuthSuccess: Checking token in localStorage:', !!localStorage.getItem('donor_jwt'));
            const response = await currentUser()
            console.log('handleOAuthSuccess: currentUser response:', { success: response.success, hasUser: !!response.user });
            
            if(!response.success) { 
                console.error('handleOAuthSuccess: Authentication failed - response.success is false');
                set({ authenticatedUser: null })
                toast.error('OAuth authentication failed. Please try again.')
                return false 
            }
            
            set({ authenticatedUser: response.user })
            toast.success('Successfully authenticated with OAuth!')
            return true
        } catch (error) {
            console.error('OAuth success handling failed:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            set({ authenticatedUser: null })
            toast.error('OAuth authentication failed. Please try again.')
            return false
        }
    },

    // Forgot password functionality
    forgotPassword: async (email) => {
        try {
            const response = await forgotPassword(email)
            if(!response.success) {
                return { success: false, message: response.message }
            }
            return { success: true, message: response.message, resetToken: response.resetToken }
        } catch (error) {
            console.log('donor forgot password store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset email'
            return { success: false, message: errorMessage }
        }
    },

    // Reset password functionality
    resetPassword: async (resetData) => {
        try {
            const response = await resetPassword(resetData)
            if(!response.success) {
                return { success: false, message: response.message }
            }
            return { success: true, message: response.message }
        } catch (error) {
            console.log('donor reset password store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password'
            return { success: false, message: errorMessage }
        }
    },

    // Check email for password reset (with detailed account info)
    checkEmailForPasswordReset: async (email) => {
        try {
            const response = await checkEmailForPasswordReset(email)
            if(!response.success) {
                return { success: false, exists: false, isOAuth: false, message: response.message }
            }
            return { 
                success: true, 
                exists: response.exists,
                isOAuth: response.isOAuth || false,
                account: response.account,
                message: response.message 
            }
        } catch (error) {
            console.log('donor check email for password reset store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to check email'
            return { success: false, exists: false, isOAuth: false, message: errorMessage }
        }
    }
}))
