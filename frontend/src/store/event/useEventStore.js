import { create } from "zustand";
import { initSocket } from "../../api/socket.js";
import toast from "react-hot-toast";
import { currentEvents, getParticipants, getParticipantRegisterStatus, insertEvent, updateEventById, deleteEvent, getParticipantCount, removeEventRegistration } from "../../services/event/eventService.js";

export const useEventStore = create((set, get) => {
    const socket = initSocket();

    // Initialize socket listener once here
    socket.on('eventStatusUpdate', ({ eventId, status }) => {
        set((state) => ({
            listEvents: state.listEvents.map(event =>
                event.event_id === eventId ? { ...event, status } : event
            )
        }));
    });

    return {
        listEvents: [],
        listParticipants: [],
        eventStatus: null,
        isRegistered: false,

        getListEvents: async () => {
            try {
                const response = await currentEvents()
                if(!response.success) {
                    console.log('get event list failed to fetch')
                    return false
                }

                set({ listEvents: response.eventList })
                return true
            } catch (error) {
                console.log('get list event failed:', error.message)
                return false
            }
        },

        getListParticipants: async (event_id) => {
            try {
                const response = await getParticipants(event_id)
                if(!response.success) {
                    set({ listParticipants: [] })
                    console.log('failed to fetch')
                    return false
                }

                set({ listParticipants: response.list })
                return true
            } catch (error) {
                console.log('get list participants failed: ', error.message)
                set({ listParticipants: [] })
                return false
            }
        },

        getParticipantRegisterStatus: async (event_id) => {
            try {
                const status = await getParticipantRegisterStatus(event_id)
                set({ isRegistered: status })
                return status
            } catch (error) {
                console.log('get participant register status failed: ', error.message)
                return false
            }
        },

        getParticipantCount: async (event_id) => {
            try {
                const response = await getParticipantCount(event_id)
                if(!response.success) {
                    console.log('get participant count failed')
                    return false
                }

                return {
                    success: true,
                    count: response.registeredParticipant
                }
            } catch (error) {
                console.log('get participant count failed: ', error.message)
            }
        },

        addEvent: async (formData) => {
            try {
                const response = await insertEvent(formData)

                if(!response.success) {
                    toast.error(response.message)
                    return false
                }

                toast.success(response.message)
                return true
            } catch (error) {
                console.log('add event failed:', error.message)
                return false
            }
        },

        updateEvent: async (id, formData) => {
            try {
                const response = await updateEventById(id, formData)
                if(!response.success) {
                    toast.error(response.message)
                    return false
                }

                toast.success(response.message)
                return true
            } catch (error) {
                console.log('update list event failed:', error.message)
                return false
            }
        },

        deleteEvent: async (id) => {
            try {
                const response = await deleteEvent(id)
                if(!response.success) {
                    toast.error(response.message)
                    return false
                }

                toast.success(response.message)
                return true
            } catch (error) {
                console.log('delete event failed:', error.message)
                return false
            }
        },

        removeEventRegistration: async (registration_id, reason) => {
            try {
                const response = await removeEventRegistration(registration_id, reason)
                if(!response.success) {
                    toast.error(response.message)
                    return false
                }

                toast.success(response.message)
                return true
            } catch (error) {
                console.log('remove event registration failed:', error.message)
                return false
            }
        }
    }
});
