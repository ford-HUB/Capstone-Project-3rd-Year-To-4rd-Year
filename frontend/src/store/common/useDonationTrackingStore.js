import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getDonationList, 
    updateDonationStatus, 
    exportDonations,
    getDonationStats 
} from "../../services/common/donationTrackingService.js";

export const useDonationTrackingStore = create((set, get) => ({
    donationListData: [],
    stats: null,
    loading: false,
    error: null,

    // Get donation list
    getDonationList: async (filters = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getDonationList(filters);
            
            if (!response.success) {
                toast.error(response.message || 'Failed to fetch donations');
                set({ loading: false, error: response.message });
                return false;
            }

            set({ 
                donationListData: response.data || [], 
                loading: false 
            });
            return true;
        } catch (error) {
            console.log('getDonationList store failed:', error.message);
            toast.error('Failed to fetch donations');
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Get donation statistics
    getDonationStats: async () => {
        try {
            const response = await getDonationStats();
            
            if (!response.success) {
                console.log('Failed to fetch donation stats:', response.message);
                return false;
            }

            set({ stats: response.data });
            return true;
        } catch (error) {
            console.log('getDonationStats store failed:', error.message);
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
            const { donationListData } = get();
            const updatedDonations = donationListData.map(donation => 
                donation.donation_id === donationId 
                    ? { ...donation, status: newStatus }
                    : donation
            );
            
            set({ 
                donationListData: updatedDonations, 
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

    // Filter donations
    filterDonations: (filters) => {
        const { donationListData } = get();
        let filtered = [...donationListData];

        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(donation => donation.status === filters.status);
        }

        if (filters.type && filters.type !== 'all') {
            filtered = filtered.filter(donation => donation.donation_type === filters.type);
        }

        if (filters.dateRange && filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (filters.dateRange) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    break;
            }
            
            filtered = filtered.filter(donation => 
                new Date(donation.createdAt) >= filterDate
            );
        }

        return filtered;
    },

    // Search donations
    searchDonations: (searchTerm) => {
        const { donationListData } = get();
        
        if (!searchTerm) return donationListData;
        
        const term = searchTerm.toLowerCase();
        return donationListData.filter(donation => 
            donation.donor?.fullname?.toLowerCase().includes(term) ||
            donation.event?.title?.toLowerCase().includes(term) ||
            donation.event?.category?.name?.toLowerCase().includes(term) ||
            donation.remark?.toLowerCase().includes(term)
        );
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Reset store
    reset: () => {
        set({
            donationListData: [],
            stats: null,
            loading: false,
            error: null
        });
    }
}));
