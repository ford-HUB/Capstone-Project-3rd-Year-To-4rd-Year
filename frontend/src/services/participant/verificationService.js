import { apiInstance } from "../../api/_base.js"

export const verifyCodeUser = async (otp) => {
    const response = await apiInstance.post(`/api/user-auth/verify-code`, { code: otp })
    return {
        success: response.data.success,
        message: response.data.message,
        user: response.data.user
    }
}

export const resendOTP = async () => {
    const response = await apiInstance.post(`/api/user-auth/resend-verification-code`)
    return {
        success: response.data.success,
        message: response.data.message,
        otp_expiration: response.data.otp_expiration,
        user: response.data.user
    }
}