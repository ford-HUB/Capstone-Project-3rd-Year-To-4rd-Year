import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"
import { requestApprovalUser, verifyStaffToken, loginUser, signupUser, currentUser} from "../../services/staff/authService.js"

export const useAuthStore = create((set) => ({
    authenticatedStaff: null,

    requestApproval: async(email) => {
        try {
            const response = await requestApprovalUser(email)
            if(!response.success) { return false, toast.error(response.message) }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('request approval hook failed:', error.message)
            return false
        }
    },

    verifyStaffRequestToken: async (token) => {
        try {
            const response = await verifyStaffToken(token)
            
            if (!response.success) {
                return { valid: false, message: response.message };
            }

            // expiration check
            const expirationDate = new Date(response.expiredToken);
            const currentDate = new Date();
            
            if (currentDate > expirationDate) {
                return { valid: false, message: 'This token has expired' };
            }

            return { valid: true, expireAt: expirationDate, token: response.yourToken, 
                message: response.message
            };

        } catch (error) {
            console.error('Verify staff token failed:', error.message);
            return { valid: false, 
                message: error.response?.data?.message
            };
        }
    },

    signup: async (token, formData) => {
        try {
            const response = await signupUser(token, formData)
            if(!response.success) {
                toast.error(response.message || 'cant insert')
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('signup staff store failed: ', error)
            return false
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
            console.log('signup staff store failed: ', error)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { return console.log('Unauthorized Access') }
            set({ authenticatedStaff: response.user })
            console.log(response.user)
            return true
        } catch (error) {
            console.log('check auth staff store failed', error.message)
            set({ authenticatedStaff: null })
            return false
        }
    }

}))