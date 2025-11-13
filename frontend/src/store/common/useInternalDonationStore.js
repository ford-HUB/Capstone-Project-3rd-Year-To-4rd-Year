import { create } from 'zustand';
import toast from 'react-hot-toast';
import { 
    getDonationList, 
    getDonationStats, 
    getOpenDonationEvents,
    updateDonationStatus, 
    bulkUpdateDonationStatus,
    exportDonations, 
    getDonationDetails
} from '../../services/common/donationTrackingService.js';

export const useInternalDonationStore = create((set, get) => ({
    allDonations: [],
    filteredDonations: [],
    donationStats: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    },

    // Get donations from API with pagination and filters
    getInternalDonationList: async (params = {}) => {
        set({ loading: true, error: null });
        
        try {
            const result = await getDonationList(params);
            
            if (result.success) {
                set({ 
                    allDonations: result.data,
                    filteredDonations: result.data,
                    pagination: result.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalCount: 0,
                        limit: 10,
                        hasNextPage: false,
                        hasPrevPage: false
                    },
                    loading: false 
                });
            } else {
                throw new Error(result.message || 'Failed to fetch donations');
            }
        } catch (error) {
            console.error('Failed to fetch internal donations:', error);
            set({ 
                error: error.message || 'Failed to fetch donation data',
                loading: false 
            });
        }
    },

    // Filter donations on frontend (kept for backward compatibility, but now using server-side filtering)
    filterDonations: (filters = {}) => {
        // Client-side filtering is now handled by server-side pagination
        // This function is kept for compatibility but doesn't do anything
        // as filtering is now done on the server
        const { allDonations } = get();
        set({ filteredDonations: allDonations });
    },

    // Get events that are open for donations
    getOpenDonationEvents: async () => {
        try {
            const result = await getOpenDonationEvents();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch open donation events');
            }
        } catch (error) {
            console.error('Failed to fetch open donation events:', error);
            throw error;
        }
    },

    // Get unique events from donations (legacy - keeping for compatibility)
    getUniqueEvents: () => {
        const { allDonations } = get();
        
        const events = allDonations
            .map(donation => donation.Event?.title)
            .filter(Boolean)
            .filter((title, index, array) => array.indexOf(title) === index)
            .sort();
        
        return events.map(title => ({
            value: title,
            label: title
        }));
    },

    // Get latest donation date
    getLatestDonationDate: () => {
        const { allDonations } = get();
        
        if (allDonations.length === 0) return null;
        
        // Sort by createdAt descending and get the first one
        const latestDonation = allDonations
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        return latestDonation?.createdAt;
    },

    // Get donation statistics from API
    getDonationStats: async () => {
        try {
            const result = await getDonationStats();
            
            if (result.success) {
                set({ donationStats: result.data });
            } else {
                throw new Error(result.message || 'Failed to fetch stats');
            }
        } catch (error) {
            console.error('Failed to fetch donation stats:', error);
            set({ 
                error: error.message || 'Failed to fetch donation statistics'
            });
        }
    },

    // Update donation status via API
    updateDonationStatus: async (donationId, status) => {
        try {
            const result = await updateDonationStatus(donationId, status);
            
            if (result.success) {
                // Update local state
                const { allDonations, filteredDonations } = get();
                const updatedAllDonations = allDonations.map(donation =>
                    donation.donation_id === donationId
                        ? { ...donation, status: status }
                        : donation
                );
                const updatedFilteredDonations = filteredDonations.map(donation =>
                    donation.donation_id === donationId
                        ? { ...donation, status: status }
                        : donation
                );
                set({ 
                    allDonations: updatedAllDonations,
                    filteredDonations: updatedFilteredDonations
                });
                
                // Show success toast
                toast.success(`Donation has been marked as ${status}!`);
                
                return { success: true, message: 'Status updated successfully' };
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update donation status:', error);
            toast.error('Failed to update donation status. Please try again.');
            throw error;
        }
    },

    // Bulk update donation status via API
    bulkUpdateDonationStatus: async (donationIds, status) => {
        try {
            const result = await bulkUpdateDonationStatus(donationIds, status);

            if (result.success) {
                // Update local state
                const { allDonations, filteredDonations } = get();
                const updatedAllDonations = allDonations.map(donation =>
                    donationIds.includes(donation.donation_id)
                        ? { ...donation, status: status }
                        : donation
                );
                const updatedFilteredDonations = filteredDonations.map(donation =>
                    donationIds.includes(donation.donation_id)
                        ? { ...donation, status: status }
                        : donation
                );
                set({
                    allDonations: updatedAllDonations,
                    filteredDonations: updatedFilteredDonations
                });

                // Show success toast
                toast.success(`Successfully updated ${result.updatedCount} donations to ${status}!`);

                return { success: true, message: result.message, updatedCount: result.updatedCount };
            } else {
                throw new Error(result.message || 'Failed to bulk update status');
            }
        } catch (error) {
            console.error('Failed to bulk update donation status:', error);
            toast.error('Failed to bulk update donation status. Please try again.');
            throw error;
        }
    },

    // Export donations via API
    exportDonations: async (filters = {}) => {
        try {
            const result = await exportDonations([]); // Export all donations
            
            if (result.success) {
                return { success: true, message: 'Donations exported successfully' };
            } else {
                throw new Error(result.message || 'Failed to export donations');
            }
        } catch (error) {
            console.error('Failed to export donations:', error);
            throw error;
        }
    },

    // Get donation details
    getDonationDetails: async (donationId) => {
        try {
            const result = await getDonationDetails(donationId);
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch donation details');
            }
        } catch (error) {
            console.error('Failed to fetch donation details:', error);
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));