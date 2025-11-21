import { create } from 'zustand'
import { 
    beneficiaryLogin, 
    beneficiaryLogout, 
    getBeneficiaryAuthStatus,
    forgotPassword,
    resetPassword,
    checkEmailForPasswordReset
} from '../../services/beneficiary/authService.js'
import { emitUserLogin, emitUserLogout, emitUserActivity, startActivityTracking, stopActivityTracking, initSocket, isSocketConnected, waitForSocketConnection } from '../../api/socket.js'
import toast from 'react-hot-toast'

export const useBeneficiaryAuthStore = create((set) => ({
    authenticatedUser: null,

    login: async (credentials) => {
        try {
            const response = await beneficiaryLogin(credentials)
            if(!response.success){ 
                return false
            }

            // Emit socket event for user login and start activity tracking
            try {
                emitUserLogin(response.userId || 'unknown', {
                    email: credentials.email,
                    role: response.role,
                    loginTime: new Date()
                });
                startActivityTracking(response.userId || 'unknown');
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
            }

            return { success: true, role: response.role }
        } catch (error) {
            console.log('beneficiary login store failed', error.message)
            return false
        }
    },

    logout: async () => {
        try {
            const response = await beneficiaryLogout()
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
            
            // Clear the authenticated user state
            set({ authenticatedUser: null })
            return true
        } catch (error) {
            console.log('beneficiary logout store failed: ', error.message)
            // Clear the authenticated user state even if logout fails
            set({ authenticatedUser: null })
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await getBeneficiaryAuthStatus()
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
                    console.log('Socket activity tracking started for authenticated beneficiary');
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

    // Forgot password functionality
    forgotPassword: async (email) => {
        try {
            const response = await forgotPassword(email)
            if(!response.success) {
                return { success: false, message: response.message }
            }
            return { success: true, message: response.message, resetToken: response.resetToken }
        } catch (error) {
            console.log('beneficiary forgot password store failed: ', error.message)
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
            console.log('beneficiary reset password store failed: ', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password'
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
            console.log('beneficiary check email for password reset store failed: ', error.message)
            return { success: false, exists: false, account: null, message: 'Error checking email' }
        }
    },

}))