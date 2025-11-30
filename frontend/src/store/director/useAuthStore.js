import { create } from "zustand"
import toast from "react-hot-toast"
import { loginUser, logoutUser, currentUser, forgotPassword, resetPassword, checkEmailForPasswordReset } from "../../services/director/authService.js"
import { emitUserLogin, emitUserLogout, emitUserActivity, startActivityTracking, stopActivityTracking, initSocket, isSocketConnected, waitForSocketConnection } from "../../api/socket.js"

export const useAuthStore = create((set) => ({
    authenticatedDirector: null,

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            // Emit socket event for user login and start activity tracking
            try {
                emitUserLogin(response.userId || 'unknown', {
                    email: formData.email,
                    role: response.role || 'director',
                    loginTime: new Date()
                });
                startActivityTracking(response.userId || 'unknown');
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
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
            // Stop activity tracking and emit logout before calling logout service
            try {
                stopActivityTracking();
            } catch (socketError) {
                console.log('Socket logout emit failed:', socketError.message);
            }

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
                set({ authenticatedDirector: null })
                return false
            }
            set({ authenticatedDirector: response.user })
            
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
                        role: response.user.role?.name || response.user.Role?.name || 'director',
                        loginTime: new Date()
                    });
                    
                    // Start activity tracking
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                    console.log('Socket activity tracking started for authenticated director user');
                } catch (connectionError) {
                    console.log('Socket connection timeout:', connectionError.message);
                    // Try to emit anyway in case socket connects later
                    emitUserLogin(response.user.account_id || response.user.id || 'unknown', {
                        email: response.user.email,
                        role: response.user.role?.name || response.user.Role?.name || 'director',
                        loginTime: new Date()
                    });
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                }
            } catch (socketError) {
                console.log('Socket initialization failed:', socketError.message);
            }
            
            return true 
        } catch (error) {
            console.log('director store auth failed:', error.message)
            set({ authenticatedDirector: null })
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