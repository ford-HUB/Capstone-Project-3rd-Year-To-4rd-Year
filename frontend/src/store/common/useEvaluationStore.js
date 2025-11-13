import { create } from "zustand";
import { getAllEventEvaluations, getEventEvaluationsByEvent } from "../../services/common/evaluationService.js";

export const useEvaluationStore = create((set, get) => ({
    evaluations: [],
    loading: false,
    error: null,

        // Get all evaluation submissions
        getAllEvaluations: async () => {
            set({ loading: true, error: null });
            try {
                const response = await getAllEventEvaluations();
                if (response.success) {
                    const evaluations = response.evaluations || [];
                    set({ evaluations: evaluations, loading: false });
                    return evaluations;
                } else {
                    set({ error: response.message || 'Failed to fetch evaluations', loading: false });
                    return [];
                }
            } catch (error) {
                set({ error: error.message, loading: false });
                return [];
            }
        },

    // Get evaluations for a specific event
    getEvaluationsByEvent: async (eventId) => {
        set({ loading: true, error: null });
        try {
            const response = await getEventEvaluationsByEvent(eventId);
            if (response.success) {
                set({ loading: false });
                return response.evaluations;
            } else {
                set({ error: 'Failed to fetch event evaluations', loading: false });
                return [];
            }
        } catch (error) {
            set({ error: error.message, loading: false });
            return [];
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset store
    reset: () => set({ evaluations: [], loading: false, error: null })
}));
