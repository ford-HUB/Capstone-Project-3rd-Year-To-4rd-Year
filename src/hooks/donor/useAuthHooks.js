import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"
import { useVerification } from "./useVerification.js"

export const useAuthHooks = create((set) => ({
    authenticatedDonor: null,

    signup: async (formData) => {
        try {
            const { setExpiresAt } = await useVerification.getState()
            const response = await apiInstance.post('/api/donor-auth/donor-signup', formData)
            if(!response.data.success){
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            await setExpiresAt(response.data.otp_expiration)
            return true
        } catch (error) {
            console.log('signup donor failed:', error.message)
            return false
        }
    },

    login: async () => {
        try {
            const response = await apiInstance.post('/api/donor-auth/donor-login', formData)
            if(!response.data.success){
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('login donor failed:', error.message)
        }
    },

    checkAuth: async () => {
        try {
            const response = await apiInstance.get('/api/donor-auth/checkAuth')
            set({ authenticatedDonor: response.data.user })
            return true
        } catch (error) {
            console.log('check donor authentication failed:', error.message)
            return false
        }
    },

}))