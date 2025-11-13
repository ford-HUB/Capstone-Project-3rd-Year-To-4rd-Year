import { useInternalDonationStore } from '../store/common/useInternalDonationStore';
import toast from 'react-hot-toast';

export const useDonationActions = () => {
    const { 
        updateDonationStatus, 
        bulkUpdateDonationStatus,
        getDonationStats, 
        getInternalDonationList,
        getLatestDonationDate
    } = useInternalDonationStore();

    // Handle status update with success/error feedback
    const handleStatusUpdate = async (donationId, newStatus) => {
        try {
            await updateDonationStatus(donationId, newStatus);
            return { success: true };
        } catch (error) {
            console.error('Failed to update donation status:', error);
            return { success: false, error };
        }
    };

    // Handle bulk status update with validation
    const handleBulkStatusUpdate = async (donationIds, status) => {
        try {
            const result = await bulkUpdateDonationStatus(donationIds, status);
            return { success: true };
        } catch (error) {
            console.error('Failed to bulk update donation status:', error);
            return { success: false, error };
        }
    };

    // Handle export with success/error feedback
    const handleExport = async () => {
        try {
            // Implementation for export functionality
            toast.info('Export functionality will be implemented soon!');
            return { success: true };
        } catch (error) {
            console.error('Failed to export donations:', error);
            toast.error('Failed to export donations. Please try again.');
            return { success: false, error };
        }
    };

    // Initialize data with optional filters and pagination
    const initializeData = async (params = {}) => {
        try {
            await Promise.all([
                getInternalDonationList(params),
                getDonationStats()
            ]);
            return { success: true };
        } catch (error) {
            console.error('Failed to initialize data:', error);
            return { success: false, error };
        }
    };

    return {
        handleStatusUpdate,
        handleBulkStatusUpdate,
        handleExport,
        initializeData,
        getLatestDonationDate
    };
};
