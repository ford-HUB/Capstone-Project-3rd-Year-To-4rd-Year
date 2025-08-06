import { create } from "zustand"
import toast from "react-hot-toast"
import { useVerificationStore } from "./useVerificationStore.js"
import { loginUser, signupUser, currentUser } from "../../services/donor/authService.js"

export const useAuthStore = create((set) => ({
    authenticatedDonor: null,

    signup: async (formData) => {
        try {
            const { setExpiresAt } = await useVerificationStore.getState()
            const response = await signupUser(formData)
            if(!response.success){
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            await setExpiresAt(response.otp_expiration)
            return true
        } catch (error) {
            console.log('signup donor failed:', error.message)
            return false
        }
    },

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success){
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('login donor store failed:', error.message)
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()

            set({ authenticatedDonor: response.user })
            return true
        } catch (error) {
            console.log('check donor auth store failed:', error.message)
            return false
        }
    },

}))