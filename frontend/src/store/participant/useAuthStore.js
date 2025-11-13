import { create } from "zustand"
import toast from "react-hot-toast"
import { useVerificationStore } from "./useVerificationStore.js"
import { loginUser, signupUser, logoutUser, currentUser, checkEmailExists, forgotPassword, resetPassword, checkEmailForPasswordReset } from "../../services/participant/authService.js"
import { emitUserLogin, emitUserLogout, emitUserActivity, startActivityTracking, stopActivityTracking, initSocket, isSocketConnected, waitForSocketConnection } from "../../api/socket.js"

export const useAuthStore = create((set) => ({
    authenticatedUser: null,
    isVerifiying: false,

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success){ 
                toast.error(response.message) 
                return false
            }

            // Emit socket event for user login and start activity tracking
            try {
                emitUserLogin(response.userId || 'unknown', {
                    email: formData.email,
                    role: response.role,
                    loginTime: new Date()
                });
                startActivityTracking(response.userId || 'unknown');
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
            }

            toast.success(response.message)
            return { success: true, role: response.role }
        } catch (error) {
            console.log('login store failed', error.message)
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
            return true;
            
        } catch (error) {
            console.log('signup store failed: ', error)
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

            // Stop activity tracking and emit socket event for user logout
            try {
                stopActivityTracking();
                emitUserLogout(response.userId || 'unknown');
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('logout store failed: ', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { return console.log('Unauthorized Access') }
            set({ authenticatedUser: response.user })
            console.log(response.user)
            
            // Initialize socket and start activity tracking for authenticated user
            try {
                // Ensure socket is initialized
                initSocket();
                
                // Wait for socket connection
                try {
                    await waitForSocketConnection(3000);
                    console.log('Socket connected, starting activity tracking...');
                    
                    // Emit user login event for already authenticated user
                    emitUserLogin(response.user.account_id || response.user.id || 'unknown', {
                        email: response.user.email,
                        role: response.user.role,
                        loginTime: new Date()
                    });
                    
                    // Start activity tracking
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                    console.log('Socket activity tracking started for authenticated user');
                } catch (connectionError) {
                    console.log('Socket connection timeout:', connectionError.message);
                    // Try to emit anyway in case socket connects later
                    emitUserLogin(response.user.account_id || response.user.id || 'unknown', {
                        email: response.user.email,
                        role: response.user.role,
                        loginTime: new Date()
                    });
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                }
            } catch (socketError) {
                console.log('Socket initialization failed:', socketError.message);
            }
            
            return true
        } catch (error) {
            console.log('check auth store failed', error.message)
            set({ authenticatedUser: null })
            return false
        }
    },

    checkEmailExists: async (email) => {
        try {
            const response = await checkEmailExists(email)
            if(!response.success) {
                toast.error(response.message || 'Failed to check email')
                return { exists: false, success: false }
            }
            return { exists: response.exists, success: true, message: response.message }
        } catch (error) {
            console.log('check email exists store failed: ', error.message)
            toast.error('Error checking email. Please try again.')
            return { exists: false, success: false }
        }
    },

    // Forgot password functionality
    forgotPassword: async (email) => {
        try {
            const response = await forgotPassword(email)
            if(!response.success) {
                toast.error(response.message || 'Failed to send reset email')
                return { success: false, message: response.message }
            }
            toast.success(response.message)
            return { success: true, message: response.message, resetToken: response.resetToken }
        } catch (error) {
            console.log('forgot password store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset email'
            toast.error(errorMessage)
            return { success: false, message: errorMessage }
        }
    },

    // Reset password functionality
    resetPassword: async (resetData) => {
        try {
            const response = await resetPassword(resetData)
            if(!response.success) {
                toast.error(response.message || 'Failed to reset password')
                return { success: false, message: response.message }
            }
            toast.success(response.message)
            return { success: true, message: response.message }
        } catch (error) {
            console.log('reset password store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password'
            toast.error(errorMessage)
            return { success: false, message: errorMessage }
        }
    },

    // Check email for password reset (with detailed account info)
    checkEmailForPasswordReset: async (email) => {
        try {
            const response = await checkEmailForPasswordReset(email)
            if(!response.success) {
                return { success: false, exists: false, account: null, message: response.message }
            }
            return { 
                success: true, 
                exists: response.exists, 
                account: response.account, 
                message: response.message 
            }
        } catch (error) {
            console.log('check email for password reset store failed: ', error.message)
            return { success: false, exists: false, account: null, message: 'Error checking email' }
        }
    },

}))