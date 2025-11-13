import { apiInstance } from "../../api/_base.js";

export const getUserCertificates = async () => {
    const response = await apiInstance.get('/api/certificate/get-your-certificates')
    return {
        success: response.data.success,
        certificateData: response.data.certificates
    }
}

export const getCertificateTotalAndEventCompletedTotal = async () => {
    const response = await apiInstance.get('/api/certificate/get-user-certificate-count-and-event-completed-count')
    return {
        success: response.data.success,
        certificateCount: response.data.certificateCount,
        eventCompletedCount: response.data.eventCount
    }
}