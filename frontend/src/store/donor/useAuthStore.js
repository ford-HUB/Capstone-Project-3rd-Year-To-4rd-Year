import { create } from "zustand"
import toast from "react-hot-toast"
import { loginUser, signupUser, logoutUser, currentUser, verifyCode, resendCode } from "../../services/donor/authService.js"

export const useAuthStore = create((set) => ({
    authenticatedDonor: null,
    isVerifying: false,

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
            console.log('donor login store failed', error.message)
            return false
        }
    },

    signup: async (formData) => {
        try {
            const response = await signupUser(formData)
            if(!response.success){ 
                toast.error(response.message) 
                return false
            }

            toast.success(response.message)
            return { success: true, otp_expiration: response.otp_expiration }
        } catch (error) {
            console.log('donor signup store failed', error.message)
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
            
            set({ authenticatedDonor: null })
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('donor logout store failed', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) { 
                return console.log('Unauthorized Access') 
            }
            set({ authenticatedDonor: response.user })
            console.log(response.user)
            return true
        } catch (error) {
            console.log('donor checkAuth store failed', error.message)
            return false
        }
    },

    verifyCode: async (code) => {
        set({ isVerifying: true })
        try {
            const response = await verifyCode(code)
            if(!response.success) {
                toast.error(response.message)
                set({ isVerifying: false })
                return false
            }
            
            toast.success(response.message)
            set({ isVerifying: false })
            return true
        } catch (error) {
            console.log('donor verify code store failed', error.message)
            set({ isVerifying: false })
            return false
        }
    },

    resendCode: async () => {
        try {
            const response = await resendCode()
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            
            toast.success(response.message)
            return { success: true, otp_expiration: response.otp_expiration }
        } catch (error) {
            console.log('donor resend code store failed', error.message)
            return false
        }
    }
}))
