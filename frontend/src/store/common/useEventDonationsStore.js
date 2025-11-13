import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getEventDonations, 
    updateDonationStatus, 
    exportDonations,
    getEventDonationStats 
} from "../../services/common/eventDonationsService.js";

export const useEventDonationsStore = create((set, get) => ({
    eventDonationsData: [],
    stats: null,
    loading: false,
    error: null,

    // Get event donations
    getEventDonations: async (filters = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getEventDonations(filters);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to fetch event donations');
                set({ loading: false, error: response.message });
                return false;
            }

            set({ 
                eventDonationsData: response.data || [], 
                loading: false 
            });
            return true;
        } catch (error) {
            console.log('getEventDonations store failed:', error.message);
            toast.error('Failed to fetch event donations');
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Get event donation statistics
    getEventDonationStats: async () => {
        try {
            const response = await getEventDonationStats();
            
            if (!response.success) {
                console.log('Failed to fetch event donation stats:', response.message);
                return false;
            }

            set({ stats: response.data });
            return true;
        } catch (error) {
            console.log('getEventDonationStats store failed:', error.message);
            return false;
        }
    },

    // Update donation status
    updateDonationStatus: async (donationId, newStatus) => {
        try {
            set({ loading: true });
            const response = await updateDonationStatus(donationId, newStatus);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to update donation status');
                set({ loading: false });
                return false;
            }

            toast.success('Donation status updated successfully');
            
            // Update the local state
            const { eventDonationsData } = get();
            const updatedDonations = eventDonationsData.map(donation => 
                donation.donation_id === donationId 
                    ? { ...donation, status: newStatus }
                    : donation
            );
            
            set({ 
                eventDonationsData: updatedDonations, 
                loading: false 
            });
            
            return true;
        } catch (error) {
            console.log('updateDonationStatus store failed:', error.message);
            toast.error('Failed to update donation status');
            set({ loading: false });
            return false;
        }
    },

    // Export donations
    exportDonations: async (selectedDonations = []) => {
        try {
            set({ loading: true });
            const response = await exportDonations(selectedDonations);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to export donations');
                set({ loading: false });
                return false;
            }

            toast.success('Donations exported successfully');
            set({ loading: false });
            return true;
        } catch (error) {
            console.log('exportDonations store failed:', error.message);
            toast.error('Failed to export donations');
            set({ loading: false });
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
            eventDonationsData: [],
            stats: null,
            loading: false,
            error: null
        });
    }
}));
