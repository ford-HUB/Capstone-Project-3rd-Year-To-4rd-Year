import { create } from 'zustand'
import { getDonorDonationHistory } from '../../services/common/donationTrackingService.js'

export const useDonationHistoryStore = create((set) => ({
    donationHistory: [],
    loading: false,
    error: null,

    fetchDonationHistory: async () => {
        set({ loading: true, error: null })
        try {
            const res = await getDonorDonationHistory()
            if (!res?.success) {
                set({ loading: false, error: res?.message || 'Failed to load donation history' })
                return false
            }
            set({ donationHistory: Array.isArray(res.data) ? res.data : [], loading: false })
            return true
        } catch (err) {
            set({ loading: false, error: err?.response?.data?.message || err.message || 'Failed to load donation history' })
            return false
        }
    },

    clear: () => set({ donationHistory: [], error: null })
}))

