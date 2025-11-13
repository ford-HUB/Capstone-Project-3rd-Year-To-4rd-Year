import { apiInstance } from "../../api/_base.js";

export const generateBothQr = async (eventId) => {
    const response = await apiInstance.get(`/api/attendance/generateBothQRCODE?eventId=${eventId}`)
    return {
        success: response.data.success,
        message: response.data.message,
        timeInQrcode: response.data.timeInQr,
        timeOutQrcode: response.data.timeOutQr
    }
}