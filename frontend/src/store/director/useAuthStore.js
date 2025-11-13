import { create } from "zustand"
import toast from "react-hot-toast"
import { loginUser, logoutUser, currentUser, forgotPassword, resetPassword, checkEmailForPasswordReset } from "../../services/director/authService.js"

export const useAuthStore = create((set) => ({
    authenticatedDirector: null,

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('login director store failed:', error.message)
            return false
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
            return true
        } catch (error) {
            console.log('logout director store failed:', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            set({ authenticatedDirector: response.user })
            return true 
        } catch (error) {
            console.log('director store auth failed:', error.message)
            return false
        }
    },

    // Forgot password functionality
    forgotPassword: async (email) => {
        try {
            const response = await forgotPassword(email)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('director forgot password failed:', error.message)
            return false
        }
    },

    // Reset password functionality
    resetPassword: async (resetData) => {
        try {
            const response = await resetPassword(resetData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('director reset password failed:', error.message)
            return false
        }
    },

    // Check email for password reset
    checkEmailForPasswordReset: async (email) => {
        try {
            const response = await checkEmailForPasswordReset(email)
            return {
                success: response.success,
                exists: response.exists,
                account: response.account,
                message: response.message
            }
        } catch (error) {
            console.log('director check email failed:', error.message)
            return {
                success: false,
                exists: false,
                account: null,
                message: 'Network error. Please try again.'
            }
        }
    }

}))