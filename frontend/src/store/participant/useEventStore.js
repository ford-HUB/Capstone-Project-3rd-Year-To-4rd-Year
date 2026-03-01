import { create } from "zustand"
import toast from "react-hot-toast"
import { currentInterest, createInterestUser, updateInterest, matchedEvent, registerEvent, eventRegistration, eventCancelledRegistration, getAllRegisteredEvent, getAllEventData, getParticipationHistory } from "../../services/participant/eventService.js"
import { getSocket, isSocketConnected } from "../../api/socket.js"

export const useEventStore = create((set, get) => ({
    interest: [],
    hasInterests: false,
    matchedEvents: [],
    eventData: [],
    recommendations: [],
    matchingProgress: null,
    isSocketConnected: false,
    isLoading: false,

    checkInterest: async () => {
        try {
            const prevState = get()
            const response = await currentInterest()
            if (!response.success) { 
                // Preserve previous interests on transient failures
                set({ 
                    interest: prevState.interest || [], 
                    hasInterests: prevState.hasInterests || false 
                }) 
                return prevState.hasInterests || false 
            }
            set({ interest: response.interest || [], hasInterests: response.hasInterest })
            return response.hasInterest
        } catch (error) {
            console.log('check interest store failed:', error.message)
            const prevState = get()
            set({ 
                interest: prevState.interest || [], 
                hasInterests: prevState.hasInterests || false 
            })
            return prevState.hasInterests || false
        }
    },

    addInterests: async (listInterest) => {
        try {
            const response = await createInterestUser(listInterest)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            // Refresh interests after adding
            const hasInterest = await this.checkInterest()
            
            // Trigger matching refresh after interests are updated
            if (hasInterest) {
                setTimeout(() => {
                    this.getMatchEvent();
                }, 1000); // Small delay to allow backend matching to complete
            }
            
            return Boolean(hasInterest)
        } catch (error) {
            console.log('add interest store failed:', error.message)
            return false
        }
    },

    updateInterest: async (updatedInterest) => {
        try {
            const response = await updateInterest(updatedInterest)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            // Refresh interests after updating
            const hasInterest = await this.checkInterest()
            
            // Trigger matching refresh after interests are updated
            if (hasInterest) {
                setTimeout(() => {
                    this.getMatchEvent();
                }, 1000); // Small delay to allow backend matching to complete
            }
            
            return Boolean(hasInterest)
        } catch (error) {
            console.log('update interest store failed:', error.message)
            return false
        }
    },

    getMatchEvent: async () => {
        try {
            set({ isLoading: true })
            const prevState = get()
            const response = await matchedEvent()
            if (!response.success) {
                console.log('matched Event failed to fetch')
                // Keep previous matches instead of clearing them on transient failures
                set({
                    matchedEvents: prevState.matchedEvents || [],
                    recommendations: prevState.recommendations || [],
                    isLoading: false
                })
                return false
            }

            set({
                matchedEvents: response.events || [],
                recommendations: response.recommendations || [],
                isLoading: false
            })
            return true
        } catch (error) {
            console.log('get matched event failed:', error.message)
            const prevState = get()
            set({
                matchedEvents: prevState.matchedEvents || [],
                recommendations: prevState.recommendations || [],
                isLoading: false
            })
            return false
        }
    },

    register_event: async (eventId, formData) => {
        try {
            const response = await registerEvent(eventId, formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('register event failed:', error.message)
            return false
        }
    },

    event_registration: async (event_id, formData) => {
        try {
            const response = await eventRegistration(event_id, formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('event registration failed: ', error.message)
        }
    },

    cancel_registration: async (event_id) => {
        try {
            const response = await eventCancelledRegistration(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('cancel registration failed: ', error)
        }
    },

    getAllRegisteredPagination: async (page, limit) => {
        const response = await getAllRegisteredEvent(page, limit)
        if(!response.success) {
            console.log('failed to fetch the records')
        }

        return {
            success: response.success,
            records: response.records,
            pagination: {
                totalRecords: response.pagination.totalRecords,
                totalPages: response.pagination.totalPages,
                currentPage: response.pagination.currentPage,
                pageSize: response.pagination.pageSize
            }
        }
    },

    getEventData: async () => {
        try {
            set({ isLoading: true })
            const response = await getAllEventData()
            if(!response.success) {
                set({ eventData: [], isLoading: false })
                return false
            }

            set({ eventData: response.eventData, isLoading: false })
            return true

        } catch (error) {
            console.log('get event data failed: ', error.message)
            set({ isLoading: false })
            return false
        }
    },

    getParticipationHistory: async (page, limit) => {
        try {
            const response = await getParticipationHistory(page, limit)
            if(!response.success) {
                console.log('Failed to fetch participation history')
                return {
                    success: false,
                    data: [],
                    summary: null,
                    pagination: null
                }
            }

            return {
                success: response.success,
                data: response.data,
                summary: response.summary,
                pagination: response.pagination
            }
        } catch (error) {
            console.log('Get participation history failed: ', error.message)
            return {
                success: false,
                data: [],
                summary: null,
                pagination: null
            }
        }
    },


    // Initialize socket connection for real-time updates
    initializeSocket: () => {
        try {
            const socket = getSocket();
            
            // Check initial connection status
            if (socket.connected) {
                set({ isSocketConnected: true });
                console.log('Socket already connected');
            } else {
                set({ isSocketConnected: false });
                console.log('Socket not connected, waiting for connection...');
            }
            
            // Set up connection event listeners
            socket.on('connect', () => {
                set({ isSocketConnected: true });
                console.log('Socket connected for event updates');
            });

            socket.on('disconnect', () => {
                set({ isSocketConnected: false });
                console.log('Socket disconnected');
            });

            socket.on('connect_error', (error) => {
                set({ isSocketConnected: false });
                console.error('Socket connection error:', error);
            });

            // Listen for volunteer matched events updates (separate from beneficiary)
            socket.on('volunteer_matched_events_updated', (data) => {
                console.log('Received volunteer matched events update:', data);
                set({ 
                    matchedEvents: data.matchedEvents || [],
                    recommendations: data.recommendations || [],
                    isLoading: false // Clear loading when new data arrives
                });
                toast.success('New event matches found!');
            });

            // Legacy listener for backward compatibility (can be removed after migration)
            socket.on('matched_events_updated', (data) => {
                console.log('Received legacy matched events update:', data);
                
                // Only handle volunteer data structure in volunteer store
                if (data.matchedEvents !== undefined) {
                    set({ 
                        matchedEvents: data.matchedEvents || [],
                        recommendations: data.recommendations || [],
                        isLoading: false
                    });
                    toast.success('New event matches found!');
                }
            });

            // Listen for matching progress updates
            socket.on('matching_progress', (data) => {
                console.log('Matching progress:', data);
                set({ matchingProgress: data });
                
                if (data.status === 'completed') {
                    set({ isLoading: false }); // Clear loading when matching completes
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
                    matchedEvents: state.matchedEvents?.filter(event => event.event_id !== eventId) || [],
                    recommendations: state.recommendations?.filter(event => event.event_id !== eventId) || [],
                    eventData: state.eventData?.filter(event => event.event_id !== eventId) || []
                }));
                
                // Show notification to user
                toast.error(`Event "${eventTitle}" has been deleted and removed from your matches.`);
            });


        } catch (error) {
            console.error('Failed to initialize socket:', error);
            set({ isSocketConnected: false });
        }
    },

    // Cleanup socket listeners
    cleanupSocket: () => {
        try {
            const socket = getSocket();
            socket.off('volunteer_matched_events_updated');
            socket.off('matched_events_updated');
            socket.off('matching_progress');
            socket.off('event_deleted');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        } catch (error) {
            console.error('Failed to cleanup socket:', error);
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
    }
}))