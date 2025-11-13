import { create } from "zustand";
import { getCertificateTotalAndEventCompletedTotal, getUserCertificates } from "../../services/common/certificateService";

export const useCertificateStore = create((set) => ({
    certificateTotal: 0,
    eventCompletedTotal: 0,
    certificateData: [],

    getCertificates: async () => {
        try {
            const response = await getUserCertificates()
            if(!response.success) {
                set({ certificateData: [] })
                console.log('get certificate fetch failed')
                return false
            }

            set({ certificateData: response.certificateData })
            return true

        } catch (error) {
            console.log('get certificate failed: ', error.message)
        }
    },

    getCertificateTotalAndEventTotal: async () => {
        try {
            const response = await getCertificateTotalAndEventCompletedTotal()
            if(!response.success) {
                console.log('fetch failed')
                set({ certificateTotal: 0, eventCompletedTotal: 0 })
                return false
            }

            set({ certificateTotal: response.certificateCount, eventCompletedTotal: response.eventCompletedCount })
            return true
        } catch (error) {
            console.log('get certificate total and event total failed: ', error.message)
        }
    }
}))