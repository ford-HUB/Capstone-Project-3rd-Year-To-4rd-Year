import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

const VERIFICATION_EXPIREATION = 'verficationExpireAt'

export const useVerification = create((set, get) => ({
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

    resendCode: async () => {
        try {
            const response = await apiInstance.post(`/api/user-auth/resend-verification-code`)
            if(!response.data.success) { 
                toast.error(response.data.message) 
                return false
            }
            await get().setExpiresAt(response.data.otp_expiration)
            toast.success(response.data.message)
            return true

        } catch (error) {
            console.log('resend code failed:', error.message)
            return false
        }
    },

    verifyCode: async (otp) => {
        try {
            const response = await apiInstance.post('/api/user-auth/verify-code', { code: otp } )
            if(!response.data.success) {
                toast.error('code failed to resent')
                return false
            }
            toast.success(response.data.message)
            return true

        } catch (error) {
            console.log('verify code failed:', error.message)
            return false
        }
    }


}))