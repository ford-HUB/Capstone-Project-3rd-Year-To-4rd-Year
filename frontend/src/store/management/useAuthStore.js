import { create } from "zustand"
import toast from "react-hot-toast"
import { requestApprovalUser, verifyToken, setAccount, loginUser, logoutUser, currentUser} from "../../services/management/authService.js"

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

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('signup management store failed: ', error)
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
            console.log('logout management failed: ', error.message)
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { 
                console.log('Unauthorized Access')
                return false
            }
            set({ authenticatedManagement: response.user })
            console.log(response.user)
            return true
        } catch (error) {
            console.log('check auth staff store failed', error.message)
            set({ authenticatedManagement: null })
            return false
        }
    }

}))