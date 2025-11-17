import { create } from "zustand"
import toast from "react-hot-toast"
import { verifyCode as verifyCodeService, resendCode as resendCodeService } from "../../services/donor/authService.js"

const VERIFICATION_EXPIREATION = 'DonorVerificationExpireAt'

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
            const response = await resendCodeService(rq_access)
            if(!response.success) { 
                toast.error(response.message) 
                return false
            }
            await get().setExpiresAt(response.otp_expiration)
            toast.success(response.message)
            return true

        } catch (error) {
            console.log('resend code failed:', error.message)
            return false
        }
    },

    verifyCode: async (otp, rq_access) => {
        try {
            const response = await verifyCodeService(otp, rq_access)
            if(!response.success) {
                toast.error(response.message || 'code failed to verify')
                return false
            }
            get().clearExpiresAt()
            toast.success(response.message)
            return true

        } catch (error) {
            console.log('verify code failed:', error.message)
            return false
        }
    }


}))