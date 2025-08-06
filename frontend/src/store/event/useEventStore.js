import { create } from "zustand";
import { apiInstance } from "../../api/_base.js";
import toast from "react-hot-toast";
import { currentEvents, insertEvent, updateEventById, deleteEvent } from "../../services/event/eventService.js";

export const useEventStore = create((set) => ({
    listEvents: [],

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
    }
}))