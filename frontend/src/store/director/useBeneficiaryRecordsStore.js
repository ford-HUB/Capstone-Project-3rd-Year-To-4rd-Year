import { create } from "zustand";
import { getBeneficiaryRecords } from "../../services/director/manageBeneficiaryService.js";
import toast from "react-hot-toast";

export const useBeneficiaryRecordsStore = create((set, get) => ({
    records: [],
    isLoading: false,
    error: null,

    /**
     * Fetch beneficiary records
     * @param {string|null} eventId - Optional event ID to filter by
     * @param {string|null} status - Optional status to filter by
     */
    fetchBeneficiaryRecords: async (eventId = null, status = null) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getBeneficiaryRecords(eventId, status);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch beneficiary records');
            }

            set({ 
                records: response.records || [],
                isLoading: false,
                error: null
            });
            
            if (response.records && response.records.length > 0) {
                console.log(`Successfully loaded ${response.records.length} beneficiary records`);
            } else {
                console.log('No beneficiary records found');
            }
            
            return true;

        } catch (error) {
            console.error('Fetch beneficiary records failed:', error.message);
            set({ 
                records: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load beneficiary records');
            return false;
        }
    },

    /**
     * Clear error state
     */
    clearError: () => set({ error: null }),

    /**
     * Reset store to initial state
     */
    reset: () => set({ 
        records: [],
        isLoading: false,
        error: null 
    })
}));

