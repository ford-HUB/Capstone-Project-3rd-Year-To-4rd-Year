import { apiInstance } from "../../api/_base.js";

/**
 * Get all upcoming events for guests
 * Public endpoint - no authentication required
 */
export const getUpcomingEvents = async () => {
    try {
        const response = await apiInstance.get('/api/guest/upcoming-events');
        return {
            success: response.data.success,
            message: response.data.message,
            events: response.data.events || []
        };
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch upcoming events',
            events: []
        };
    }
};

