import { create } from "zustand";
import toast from "react-hot-toast";
import { getAllUsersActivityLogs as getAllUsersActivityLogsService } from "../../services/director/allUsersActivityLogService.js";

export const useAllUsersActivityLogStore = create((set) => ({
    logs: [],
    isLoading: false,
    error: null,
    total: 0,

    getAllUsersActivityLogs: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAllUsersActivityLogsService(params);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch activity logs');
            }

            set({ 
                logs: response.logs || [],
                total: response.total || 0,
                isLoading: false,
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[All Users Activity Log Store] Get all users activity logs failed:', error.message);
            set({ 
                logs: [],
                total: 0,
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
        total: 0,
        isLoading: false,
        error: null 
    })
}));

