import { create } from "zustand";
import toast from "react-hot-toast";
import { getMyActivityLogs as getMyActivityLogsService } from "../../services/management/activityLogService.js";

export const useActivityLogStore = create((set) => ({
    logs: [],
    isLoading: false,
    error: null,

    getMyActivityLogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getMyActivityLogsService();
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch activity logs');
            }

            set({ 
                logs: response.logs || [],
                isLoading: false,
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[Activity Log Store] Get my activity logs failed:', error.message);
            set({ 
                logs: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load activity logs');
            return false;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        logs: [],
        isLoading: false,
        error: null 
    })
}));

