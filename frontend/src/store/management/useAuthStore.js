import { create } from "zustand"
import toast from "react-hot-toast"
import { requestApprovalUser, verifyToken, setAccount, loginUser, logoutUser, currentUser} from "../../services/management/authService.js"
import { emitUserLogin, emitUserLogout, emitUserActivity, startActivityTracking, stopActivityTracking, initSocket, isSocketConnected, waitForSocketConnection } from "../../api/socket.js"

export const useAuthStore = create((set) => ({
    authenticatedManagement: null,
    acceptedRole: '',

    requestApproval: async(formData) => {
        try {
            const response = await requestApprovalUser(formData)
            if(!response.success) { return false, toast.error(response.message) }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('request approval hook failed:', error.message)
            return false
        }
    },

    RequestToken: async (token) => {
        try {
            const response = await verifyToken(token)
            
            if (!response.success) {
                return { valid: false, message: response.message };
            }

            // expiration check
            const expirationDate = new Date(response.expiredToken);
            const currentDate = new Date();
            
            if (currentDate > expirationDate) {
                return { valid: false, message: 'This token has expired' };
            }
            set({ acceptedRole: response.role })
            return { 
                valid: true, expireAt: expirationDate, token: response.yourToken, message: response.message
            }

        } catch (error) {
            console.error('Verify token failed:', error.message);
            return { valid: false, 
                message: error.response?.data?.message
            };
        }
    },

    registerAccount: async (formData, token) => {
        try {
            const response = await setAccount(formData, token)
            if(!response.success) {
                toast.error(response.message)
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('register account management failed:', error.message)
        }
    },

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
                    role: response.role,
                    loginTime: new Date()
                });
                startActivityTracking(response.userId || 'unknown');
            } catch (socketError) {
                console.log('Socket emit failed:', socketError.message);
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('signup management store failed: ', error)
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
            console.log('logout management failed: ', error.message)
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { 
                console.log('Unauthorized Access')
                set({ authenticatedManagement: null })
                return false
            }
            set({ authenticatedManagement: response.user })
            
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
                        role: response.user.role?.name || response.user.Role?.name || 'unknown',
                        loginTime: new Date()
                    });
                    
                    // Start activity tracking
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                    console.log('Socket activity tracking started for authenticated management user');
                } catch (connectionError) {
                    console.log('Socket connection timeout:', connectionError.message);
                    // Try to emit anyway in case socket connects later
                    emitUserLogin(response.user.account_id || response.user.id || 'unknown', {
                        email: response.user.email,
                        role: response.user.role?.name || response.user.Role?.name || 'unknown',
                        loginTime: new Date()
                    });
                    startActivityTracking(response.user.account_id || response.user.id || 'unknown');
                }
            } catch (socketError) {
                console.log('Socket initialization failed:', socketError.message);
            }
            
            return true
        } catch (error) {
            console.log('check auth staff store failed', error.message)
            set({ authenticatedManagement: null })
            return false
        }
    }

}))