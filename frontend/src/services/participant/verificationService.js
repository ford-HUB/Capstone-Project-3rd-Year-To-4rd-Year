import { apiInstance } from "../../api/_base.js"

export const verifyCodeUser = async (otp, rq_access) => {
    const response = await apiInstance.post(`/api/user-auth/verify-code?rq_access=${encodeURIComponent(rq_access)}`, { code: otp })
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const resendOTP = async (rq_access) => {
    const response = await apiInstance.post(`/api/user-auth/resend-verification-code?rq_access=${encodeURIComponent(rq_access)}`)
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration
    }
}