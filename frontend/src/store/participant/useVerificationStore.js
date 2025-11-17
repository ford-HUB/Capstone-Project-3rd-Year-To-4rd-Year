import { create } from "zustand"
import toast from "react-hot-toast"
import { verifyCodeUser, resendOTP } from "../../services/participant/verificationService.js"

const VERIFICATION_EXPIREATION = 'verficationExpireAt'

export const useVerificationStore = create((set, get) => ({
    otp_expiration: localStorage.getItem(VERIFICATION_EXPIREATION) || null,

    setExpiresAt: async (timestamp) => {
        try {
            localStorage.setItem(VERIFICATION_EXPIREATION, timestamp)
            set({ otp_expiration: timestamp })
        } catch (error) {
            console.log('set expires at failed:', error.message)
            set({ otp_expiration: null })
        }
    },

    clearExpiresAt: () => {
        localStorage.removeItem(VERIFICATION_EXPIREATION);
        set({ otp_expiration: null });
    },

    resendCode: async (rq_access) => {
        try {
            const response = await resendOTP(rq_access)
            if(!response.success) { 
                toast.error(response.message) 
                return false
            }
            await get().setExpiresAt(response.otp_expiration)
            toast.success(response.message)
            return true

        } catch (error) {
            console.log('resend code store failed:', error.message)
            return false
        }
    },

    verifyCode: async (otp, rq_access) => {
        try {
            const response = await verifyCodeUser(otp, rq_access)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            // toast.success(response.message)
            return true

        } catch (error) {
            console.log('verify code store failed:', error.message)
            return false
        }
    }


}))