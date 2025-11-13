import { create } from 'zustand'
import { getDonorTracking } from '../../services/common/donationTrackingService.js'

export const useMyDonationsStore = create((set) => ({
    myDonations: [],
    loading: false,
    error: null,

    fetchMyDonations: async () => {
        set({ loading: true, error: null })
        try {
            const res = await getDonorTracking()
            if (!res?.success) {
                set({ loading: false, error: res?.message || 'Failed to load donations' })
                return false
            }
            set({ myDonations: Array.isArray(res.data) ? res.data : [], loading: false })
            return true
        } catch (err) {
            set({ loading: false, error: err?.response?.data?.message || err.message || 'Failed to load donations' })
            return false
        }
    },

    clear: () => set({ myDonations: [], error: null })
}))


