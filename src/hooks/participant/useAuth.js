import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"
import { useVerification } from "./useVerification.js"

export const useAuth = create((set) => ({
    authenticatedUser: null,
    isVerifiying: false,

    signup: async (formData) => {
        try {
            const { setExpiresAt } = useVerification.getState()
            const response = await apiInstance.post('/api/user-auth/user-signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message);
            await setExpiresAt(response.data.otp_expiration)
            return true;
        } catch (error) {
            console.log('student signup failed: ', error.message)
            return false;
        }
    },

    login: async (formData) => {
        try {
            const response = await apiInstance.post('/api/user-auth/user-login', formData)
            if(!response.data.success){ 
                toast.error(response.data.message) 
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('login hooks in participant failed', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await apiInstance.get('/api/user-auth/checkAuth')
            if(!response.data.success) { return console.log('user is not authenticated') }
            set({ authenticatedUser: response.data.user })
            console.log(response.data.user)
            return true
        } catch (error) {
            console.log('check auth hooks in participant failed', error.message)
            set({ authenticatedUser: null })
            return false
        }
    },

    logout: async () => {
        try {
            const response = await apiInstance.post('/api/user-auth/user-logout')
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('logout failed: ', error.message)
            return false
        }
    }
}))