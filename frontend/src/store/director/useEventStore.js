import { create } from "zustand";
import { 
    getAllEvents, 
    registerEventDirector as registerEventDirectorService, 
    unRegisterEventDirector as unRegisterEventDirectorService 
} from "../../services/director/eventService.js";
import toast from "react-hot-toast";

export const useEventStore = create((set, get) => ({
    events: [],
    isLoading: false,
    error: null,

    fetchAllEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAllEvents();
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch events');
            }

            set({ 
                events: response.events || [],
                isLoading: false,
                error: null
            });
            
            return true;
        } catch (error) {
            console.error('Fetch all events failed:', error.message);
            set({ 
                events: [],
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load events');
            return false;
        }
    },

    registerEventDirector: async (event_id) => {
        try {
            const response = await registerEventDirectorService(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('register event failed: ', error.message)
            return false
        }
    },

    unRegisterEventDirector: async (event_id) => {
        try {
            const response = await unRegisterEventDirectorService(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('unregister event failed: ', error.message)
            return false
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        events: [],
        isLoading: false,
        error: null 
    })
}))