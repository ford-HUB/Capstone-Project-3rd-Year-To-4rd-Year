import { create } from "zustand"
import toast from "react-hot-toast"
import { verifyCodeUser, resendOTP } from "../../services/participant/verificationService.js"

const VERIFICATION_EXPIREATION = 'verficationExpireAt'
const VERIFICATION_USER_DATA = 'verificationUserData'

export const useVerificationStore = create((set, get) => ({
    otp_expiration: localStorage.getItem(VERIFICATION_EXPIREATION) || null,
    userData: (() => {
        try {
            const stored = localStorage.getItem(VERIFICATION_USER_DATA)
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })(),

    setExpiresAt: async (timestamp) => {
        try {
            localStorage.setItem(VERIFICATION_EXPIREATION, timestamp)
            set({ otp_expiration: timestamp })
        } catch (error) {
            console.log('set expires at failed:', error.message)
            set({ otp_expiration: null })
        }
    },

    setUserData: (userData) => {
        try {
            localStorage.setItem(VERIFICATION_USER_DATA, JSON.stringify(userData))
            set({ userData })
        } catch (error) {
            console.log('set user data failed:', error.message)
            set({ userData: null })
        }
    },

    clearExpiresAt: () => {
        localStorage.removeItem(VERIFICATION_EXPIREATION);
        set({ otp_expiration: null });
    },

    clearUserData: () => {
        localStorage.removeItem(VERIFICATION_USER_DATA);
        set({ userData: null });
    },

    clearAll: () => {
        get().clearExpiresAt()
        get().clearUserData()
    },

    resendCode: async () => {
        try {
            const response = await resendOTP()
            if(!response.success) { 
                toast.error(response.message) 
                return false
            }
            await get().setExpiresAt(response.otp_expiration)
            if (response.user) {
                get().setUserData(response.user)
            }
            toast.success(response.message)
            return true

        } catch (error) {
            console.log('resend code store failed:', error.message)
            return false
        }
    },

    verifyCode: async (otp) => {
        try {
            const response = await verifyCodeUser(otp)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            get().clearAll()
            return true

        } catch (error) {
            console.log('verify code store failed:', error.message)
            return false
        }
    }

}))