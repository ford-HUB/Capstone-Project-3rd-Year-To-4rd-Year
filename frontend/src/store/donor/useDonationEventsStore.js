import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getEventsOpenForDonations, 
    getEventDonationStats,
    setupDonationUpdates 
} from "../../services/donation/donationService.js";

export const useDonationEventsStore = create((set, get) => ({
    events: [],
    loading: false,
    error: null,

    // Get events open for donations
    getEventsOpenForDonations: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getEventsOpenForDonations();
            
            if (!response.success) {
                toast.error(response.message || 'Failed to fetch events');
                set({ loading: false, error: response.message });
                return false;
            }

            set({ 
                events: response.data || [], 
                loading: false 
            });
            return true;
        } catch (error) {
            console.log('getEventsOpenForDonations store failed:', error.message);
            toast.error('Failed to fetch events');
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Get event donation statistics
    getEventDonationStats: async (eventId) => {
        try {
            const response = await getEventDonationStats(eventId);
            
            if (!response.success) {
                console.log('Failed to fetch event donation stats:', response.message);
                return false;
            }

            return response.data;
        } catch (error) {
            console.log('getEventDonationStats store failed:', error.message);
            return false;
        }
    },

    setupDonationUpdates: (socket, onDonationUpdate) => {
        if (!socket) {
            console.warn('Socket not provided for donation updates');
            return;
        }

        const cleanup = setupDonationUpdates(socket, (data) => {
            console.log('Donation update received:', data);
            get().getEventsOpenForDonations();
            if (onDonationUpdate) {
                onDonationUpdate(data);
            }
        });

        return cleanup;
    },

    setupNewEventNotifications: (socket) => {
        if (!socket) {
            console.warn('Socket not provided for new event notifications');
            return;
        }

        const handleNewEventAvailable = (data) => {
            console.log('New event available for donations:', data);
            get().getEventsOpenForDonations();
        };

        socket.on('event_available_for_donations', handleNewEventAvailable);

        return () => {
            socket.off('event_available_for_donations', handleNewEventAvailable);
        };
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Reset store
    reset: () => {
        set({
            events: [],
            loading: false,
            error: null
        });
    }
}));
