import { create } from "zustand";
import { getSystemPerformanceMetrics, getPerformanceHistory } from "../../services/director/systemPerformanceService.js";
import toast from "react-hot-toast";

export const useSystemPerformanceStore = create((set, get) => ({
    metrics: null,
    history: null,
    isLoading: false,
    lastUpdated: null,

    // Get real-time system performance metrics
    getMetrics: async () => {
        set({ isLoading: true });
        try {
            const response = await getSystemPerformanceMetrics();
            if (response.success) {
                set({ 
                    metrics: response.data,
                    lastUpdated: new Date(),
                    isLoading: false 
                });
                return true;
            } else {
                toast.error('Failed to load system metrics');
                set({ isLoading: false });
                return false;
            }
        } catch (error) {
            console.error('Get metrics failed:', error.message);
            toast.error('Failed to load system metrics');
            set({ isLoading: false });
            return false;
        }
    },

    // Get performance history
    getHistory: async (hours = 24) => {
        set({ isLoading: true });
        try {
            const response = await getPerformanceHistory(hours);
            if (response.success) {
                set({ 
                    history: response.data,
                    isLoading: false 
                });
                return true;
            } else {
                toast.error('Failed to load performance history');
                set({ isLoading: false });
                return false;
            }
        } catch (error) {
            console.error('Get history failed:', error.message);
            toast.error('Failed to load performance history');
            set({ isLoading: false });
            return false;
        }
    },

    // Refresh all data
    refreshAll: async () => {
        const metricsSuccess = await get().getMetrics();
        const historySuccess = await get().getHistory();
        return metricsSuccess && historySuccess;
    },

    // Clear all data
    clearData: () => {
        set({ 
            metrics: null, 
            history: null, 
            lastUpdated: null 
        });
    }
}));
