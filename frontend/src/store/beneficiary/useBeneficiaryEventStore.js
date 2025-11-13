import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getBeneficiaryMatchedEvents, 
    registerBeneficiaryForEvent, 
    cancelBeneficiaryRegistration,
    getBeneficiaryRegisteredEvents,
    getBeneficiaryPendingRegistrations,
    getBeneficiaryAttendanceRecords,
    getBeneficiaryCompletedAttendanceRecords,
    refreshBeneficiaryMatches,
    getBeneficiaryParticipationHistory
} from "../../services/beneficiary/eventService.js";
import { getSocket, isSocketConnected } from "../../api/socket.js";

export const useBeneficiaryEventStore = create((set, get) => ({
    nearYouEvents: [],
    almostNearYouEvents: [],
    recommendations: [],
    registeredEvents: [],
    pendingRegistrations: [],
    attendanceRecords: [],
    beneficiaryLocation: '',
    beneficiaryCity: '',
    matchingProgress: null,
    isSocketConnected: false,
    isLoading: false,

    // Get location-based matched events
    getMatchedEvents: async () => {
        try {
            set({ isLoading: true });
            const response = await getBeneficiaryMatchedEvents();
            
            if (!response.success) {
                set({ 
                    nearYouEvents: [], 
                    almostNearYouEvents: [],
                    recommendations: [], 
                    isLoading: false 
                });
                return false;
            }

            
            set({ 
                nearYouEvents: response.nearYou || [],
                almostNearYouEvents: response.almostNearYou || [],
                recommendations: response.recommendations || [],
                beneficiaryLocation: response.beneficiaryLocation || '',
                beneficiaryCity: response.beneficiaryCity || '',
                isLoading: false 
            });
            return true;
        } catch (error) {
            console.error('getBeneficiaryMatchedEvents failed:', error.message);
            set({ 
                nearYouEvents: [], 
                almostNearYouEvents: [],
                recommendations: [], 
                isLoading: false 
            });
            return false;
        }
    },

    // Register for an event
    registerForEvent: async (eventId, formData) => {
        try {
            const response = await registerBeneficiaryForEvent(eventId, formData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }

            toast.success(response.message);
            // Refresh events after registration to remove registered events from recommendations
            await get().getMatchedEvents();
            return true;
        } catch (error) {
            console.log('registerForEvent failed:', error.message);
            toast.error('Registration failed');
            return false;
        }
    },

    // Cancel event registration
    cancelRegistration: async (eventId) => {
        try {
            const response = await cancelBeneficiaryRegistration(eventId);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }

            toast.success(response.message);
            // Refresh events after cancellation to add the event back to recommendations
            await get().getMatchedEvents();
            return true;
        } catch (error) {
            console.log('cancelRegistration failed:', error.message);
            toast.error('Cancellation failed');
            return false;
        }
    },

    // Get registered events
    getRegisteredEvents: async (page = 1, limit = 5) => {
        try {
            console.log('Store: Fetching registered events...', { page, limit });
            const response = await getBeneficiaryRegisteredEvents(page, limit);
            console.log('Store: Registered events response:', response);
            
            if (!response.success) {
                console.log('Store: Failed to fetch registered events:', response);
                return {
                    success: false,
                    data: [],
                    pagination: null
                };
            }

            console.log('Store: Setting registered events:', response.data);
            set({ registeredEvents: response.data || [] });
            return {
                success: response.success,
                data: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.log('Store: getRegisteredEvents failed:', error.message);
            return {
                success: false,
                data: [],
                pagination: null
            };
        }
    },

    // Get pending registrations
    getPendingRegistrations: async (page = 1, limit = 5) => {
        try {
            console.log('Store: Fetching pending registrations...', { page, limit });
            const response = await getBeneficiaryPendingRegistrations(page, limit);
            console.log('Store: Pending registrations response:', response);
            
            if (!response.success) {
                console.log('Store: Failed to fetch pending registrations');
                return {
                    success: false,
                    data: [],
                    pagination: null
                };
            }

            console.log('Store: Setting pending registrations:', response.data);
            set({ pendingRegistrations: response.data || [] });
            return {
                success: response.success,
                data: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.log('Store: getPendingRegistrations failed:', error.message);
            return {
                success: false,
                data: [],
                pagination: null
            };
        }
    },

    // Refresh location-based matches
    refreshMatches: async () => {
        try {
            set({ isLoading: true });
            const response = await refreshBeneficiaryMatches();
            if (!response.success) {
                toast.error(response.message);
                set({ isLoading: false });
                return false;
            }

            toast.success(response.message);
            // Refresh events after matching
            await get().getMatchedEvents();
            return true;
        } catch (error) {
            console.log('refreshMatches failed:', error.message);
            toast.error('Failed to refresh matches');
            set({ isLoading: false });
            return false;
        }
    },

    // Initialize socket connection for real-time updates
    initializeSocket: () => {
        try {
            const socket = getSocket();
            
            // Check initial connection status
            if (socket.connected) {
                set({ isSocketConnected: true });
                console.log('Socket already connected for beneficiary events');
            } else {
                set({ isSocketConnected: false });
                console.log('Socket not connected, waiting for connection...');
            }
            
            // Set up connection event listeners
            socket.on('connect', () => {
                set({ isSocketConnected: true });
                console.log('Socket connected for beneficiary event updates');
            });

            socket.on('disconnect', () => {
                set({ isSocketConnected: false });
                console.log('Socket disconnected');
            });

            socket.on('connect_error', (error) => {
                set({ isSocketConnected: false });
                console.error('Socket connection error:', error);
            });

            // Listen for beneficiary matched events updates (separate from volunteer)
            socket.on('beneficiary_matched_events_updated', (data) => {
                console.log('Received beneficiary matched events update:', data);
                set({ 
                    nearYouEvents: data.nearYou || [],
                    almostNearYouEvents: data.almostNearYou || [],
                    recommendations: data.recommendations || [],
                    isLoading: false
                });
                toast.success('New location-based event matches found!');
            });

            // Legacy listener for backward compatibility (can be removed after migration)
            socket.on('matched_events_updated', (data) => {
                console.log('Received legacy matched events update:', data);
                
                // Only handle beneficiary data structure in beneficiary store
                if (data.nearYou !== undefined) {
                    set({ 
                        nearYouEvents: data.nearYou || [],
                        almostNearYouEvents: data.almostNearYou || [],
                        recommendations: data.recommendations || [],
                        isLoading: false
                    });
                    toast.success('New location-based event matches found!');
                }
            });

            // Listen for matching progress updates
            socket.on('matching_progress', (data) => {
                console.log('Beneficiary matching progress:', data);
                set({ matchingProgress: data });
                
                if (data.status === 'completed') {
                    set({ isLoading: false });
                    setTimeout(() => {
                        set({ matchingProgress: null });
                    }, 3000);
                }
            });

            // Listen for event deletion updates
            socket.on('event_deleted', (data) => {
                console.log('Event deleted:', data);
                const { eventId, eventTitle } = data;
                
                // Remove the deleted event from all event lists
                set((state) => ({
                    nearYouEvents: state.nearYouEvents?.filter(event => event.event_id !== eventId) || [],
                    almostNearYouEvents: state.almostNearYouEvents?.filter(event => event.event_id !== eventId) || [],
                    recommendations: state.recommendations?.filter(event => event.event_id !== eventId) || [],
                    registeredEvents: state.registeredEvents?.filter(event => event.event_id !== eventId) || []
                }));
                
                toast.error(`Event "${eventTitle}" has been deleted and removed from your matches.`);
            });

        } catch (error) {
            console.error('Failed to initialize socket for beneficiary:', error);
            set({ isSocketConnected: false });
        }
    },

    // Cleanup socket listeners
    cleanupSocket: () => {
        try {
            const socket = getSocket();
            socket.off('beneficiary_matched_events_updated');
            socket.off('matched_events_updated');
            socket.off('matching_progress');
            socket.off('event_deleted');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        } catch (error) {
            console.error('Failed to cleanup socket for beneficiary:', error);
        }
    },

    // Check and update connection status
    checkConnectionStatus: () => {
        try {
            const connected = isSocketConnected();
            set({ isSocketConnected: connected });
            console.log('Manual connection check:', connected ? 'Connected' : 'Disconnected');
            return connected;
        } catch (error) {
            console.error('Failed to check connection status:', error);
            set({ isSocketConnected: false });
            return false;
        }
    },

    // Clear loading state
    clearLoading: () => {
        set({ isLoading: false });
    },

    // Get attendance records
    getAttendanceRecords: async (page = 1, limit = 10, month = null, year = null) => {
        try {
            console.log('Store: Fetching attendance records...', { page, limit, month, year });
            // Use completed + registered attendance endpoint
            const response = await getBeneficiaryCompletedAttendanceRecords(page, limit, month, year);
            console.log('Store: Attendance records response:', response);
            
            if (!response.success) {
                console.log('Store: Failed to fetch attendance records:', response);
                return {
                    success: false,
                    data: [],
                    pagination: null
                };
            }

            console.log('Store: Setting attendance records:', response.data);
            set({ attendanceRecords: response.data || [] });
            return {
                success: response.success,
                data: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.log('Store: getAttendanceRecords failed:', error.message);
            return {
                success: false,
                data: [],
                pagination: null
            };
        }
    },

    // Get beneficiary participation history (mirror volunteer)
    getBeneficiaryParticipationHistory: async (page = 1, limit = 10) => {
        try {
            const response = await getBeneficiaryParticipationHistory(page, limit);
            return response;
        } catch (error) {
            console.log('Store: getBeneficiaryParticipationHistory failed:', error.message);
            return { success: false, data: [], pagination: null };
        }
    }
}));
