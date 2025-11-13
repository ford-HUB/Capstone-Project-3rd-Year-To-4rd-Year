import { create } from "zustand";
import { getDepartmentOverview, getStaffOverview } from "../../services/management/overviewService.js";

export const useOverviewStore = create((set, get) => ({
    overview: null,
    loading: false,
    error: null,
    lastUpdated: null,

    // Fetch department overview for coordinators
    getDepartmentOverview: async () => {
        set({ loading: true, error: null });
        
        try {
            const response = await getDepartmentOverview();
            console.log('Overview API Response:', response);
            
            if (response.success && response.data) {
                console.log('Overview data received:', response.data);
                set({ 
                    overview: response.data,
                    loading: false,
                    error: null,
                    lastUpdated: new Date()
                });
                return true;
            } else {
                console.error('Overview API returned error:', response);
                set({ 
                    error: response.message || 'Failed to fetch overview data',
                    loading: false
                });
                return false;
            }
        } catch (error) {
            console.error('getDepartmentOverview store failed:', error);
            console.error('Error details:', error.response?.data || error.message);
            set({ 
                error: error.message || 'Failed to load overview data',
                loading: false
            });
            return false;
        }
    },

    // Fetch staff overview (system-wide stats)
    getStaffOverview: async () => {
        set({ loading: true, error: null });
        
        try {
            const response = await getStaffOverview();
            console.log('Staff Overview API Response:', response);
            
            if (response.success && response.data) {
                console.log('Staff overview data received:', response.data);
                set({ 
                    overview: response.data,
                    loading: false,
                    error: null,
                    lastUpdated: new Date()
                });
                return true;
            } else {
                console.error('Staff Overview API returned error:', response);
                set({ 
                    error: response.message || 'Failed to fetch staff overview data',
                    loading: false
                });
                return false;
            }
        } catch (error) {
            console.error('getStaffOverview store failed:', error);
            console.error('Error details:', error.response?.data || error.message);
            set({ 
                error: error.message || 'Failed to load staff overview data',
                loading: false
            });
            return false;
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Reset store
    reset: () => {
        set({ 
            overview: null,
            loading: false,
            error: null,
            lastUpdated: null
        });
    }
}));

