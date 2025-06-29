import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useAuthHooks = create((set) => ({
    authenticatedStaff: null,

    requestApproval: async(email) => {
        try {
            const response = await apiInstance.post('/api/staff-auth/request-approval', email)
            if(!response.data.success) { return false, toast.error(response.data.message) }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('request approval hook failed:', error.message)
            return false
        }
    },

    verifyStaffRequestToken: async (token) => {
        try {
            const response = await apiInstance.get(`/api/staff-auth/check-authenticated-token/${token}`);
            
            if (!response.data.success) {
                return { valid: false, message: response.data.message };
            }

            // expiration check
            const expirationDate = new Date(response.data.expiredToken);
            const currentDate = new Date();
            
            if (currentDate > expirationDate) {
                return { valid: false, message: 'This token has expired' };
            }

            return { valid: true, expireAt: expirationDate, token: response.data.yourToken, 
                message: response.data.message
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
            const response = await apiInstance.post(`/api/staff-auth/staff-signup/${token}`, formData)
            if(!response.data.success) {
                toast.error(response.data.message || 'cant insert')
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('signup staff failed: ', error)
            return false
        }
    },

    login: async (formData) => {
        try {
            const response = await apiInstance.post('/api/staff-auth/staff-login', formData)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('signup staff failed: ', error)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await apiInstance.get('/api/staff-auth/check-auth-staff')
            if(!response.data.success) { return console.log('user is not authenticated') }
            set({ authenticatedStaff: response.data.user })
            console.log(response.data.user)
            return true
        } catch (error) {
            console.log('check auth hooks in participant failed', error.message)
            set({ authenticatedStaff: null })
            return false
        }
    }

}))