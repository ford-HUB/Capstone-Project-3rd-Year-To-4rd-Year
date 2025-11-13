import { create } from "zustand";
import toast from "react-hot-toast";
import { getAllPendingRegistrations, approveRegistration as approveRegistrationService, declineRegistration as declineRegistrationService } from "../../services/director/manageBeneficiaryService.js";

export const useBeneficiaryRequestStore = create((set, get) => ({
    pendingRegistrations: [],
    isLoading: false,
    error: null,

    getAllPendingRegistrations: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log('[Director Store] Fetching pending registrations...');
            const response = await getAllPendingRegistrations()
            console.log('[Director Store] Response received:', response);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch pending registrations');
            }

            console.log('[Director Store] Setting pending registrations:', response.registrations);
            set({ 
                pendingRegistrations: response.registrations || [],
                isLoading: false,
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[Director Store] Get pending registrations failed:', error.message);
            set({ 
                pendingRegistrations: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load pending registrations');
            return false;
        }
    },

    approveRegistration: async (registrationId) => {
        set({ isLoading: true });
        try {
            const response = await approveRegistrationService(registrationId)
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to approve registration');
            }

            // Remove the approved registration from pending list
            set(state => ({
                pendingRegistrations: state.pendingRegistrations.filter(
                    reg => reg.event_registration_id !== registrationId
                ),
                isLoading: false
            }));

            toast.success('Registration approved successfully');
            return true;

        } catch (error) {
            console.error('Approve registration failed:', error.message);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to approve registration');
            return false;
        }
    },

    declineRegistration: async (registrationId, reason = '') => {
        set({ isLoading: true });
        try {
            const response = await declineRegistrationService(registrationId, reason)
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to decline registration');
            }

            // Remove the declined registration from pending list
            set(state => ({
                pendingRegistrations: state.pendingRegistrations.filter(
                    reg => reg.event_registration_id !== registrationId
                ),
                isLoading: false
            }));

            toast.success('Registration declined successfully');
            return true;

        } catch (error) {
            console.error('Decline registration failed:', error.message);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || 'Failed to decline registration');
            return false;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        pendingRegistrations: [],
        isLoading: false,
        error: null 
    })
}));
