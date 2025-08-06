import { create } from "zustand"
import toast from "react-hot-toast"
import { useVerificationStore } from "./useVerificationStore.js"
import { loginUser, signupUser, logoutUser, currentUser } from "../../services/participant/authService.js"

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
                toast.error(response.message)
                return false
            }

            toast.success(response.message);
            await setExpiresAt(response.otp_expiration)
            return true;
        } catch (error) {
            console.log('signup store failed: ', error.message)
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
            return true
        } catch (error) {
            console.log('check auth store failed', error.message)
            set({ authenticatedUser: null })
            return false
        }
    }
}))