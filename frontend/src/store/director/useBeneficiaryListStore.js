import { create } from "zustand";
import { apiInstance } from "../../api/_base.js";
import toast from "react-hot-toast";

export const useBeneficiaryListStore = create((set, get) => ({
    allRegistrations: [],
    isLoading: false,
    error: null,

    getAllRegistrations: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiInstance.get('/api/director/manage-beneficiary/beneficiary-list');
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch registrations');
            }

            set({ 
                allRegistrations: response.data.registrations || [],
                isLoading: false,
                error: null
            });
            
            // Log success or empty state
            if (response.data.registrations && response.data.registrations.length > 0) {
                console.log(`Successfully loaded ${response.data.registrations.length} registrations`);
            } else {
                console.log('No registrations found - this is normal if no data exists');
            }
            return true;

        } catch (error) {
            console.error('Get all registrations failed:', error.message);
            set({ 
                allRegistrations: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load registrations');
            return false;
        }
    },

    getRegistrationsByStatus: async (status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiInstance.get(`/api/director/manage-beneficiary/beneficiary-list?status=${status}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch registrations');
            }

            set({ 
                allRegistrations: response.data.registrations || [],
                isLoading: false 
            });
            return true;

        } catch (error) {
            console.error('Get registrations by status failed:', error.message);
            set({ 
                allRegistrations: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load registrations');
            return false;
        }
    },

    getRegistrationsByEvent: async (eventId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiInstance.get(`/api/director/manage-beneficiary/beneficiary-list?event_id=${eventId}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch registrations');
            }

            set({ 
                allRegistrations: response.data.registrations || [],
                isLoading: false 
            });
            return true;

        } catch (error) {
            console.error('Get registrations by event failed:', error.message);
            set({ 
                allRegistrations: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load registrations');
            return false;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        allRegistrations: [],
        isLoading: false,
        error: null 
    })
}));
