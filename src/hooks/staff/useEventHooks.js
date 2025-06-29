import { create } from "zustand";
import { apiInstance } from "../../api/_base.js";
import toast from "react-hot-toast";

export const useEventHooks = create((set) => ({
    listEvents: [],

    addEvent: async (formData) => {
        try {
            const response = await apiInstance.post('/api/staff-event/add-event', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('add event failed:', error.message)
            return false
        }
    },

    getListEvents: async () => {
        try {
            const response = await apiInstance.get('/api/staff-event/list-event')
            if(!response.data.success) {
                console.log('get list events not successfully fetched')
                return false
            }

            set({ listEvents: response.data.list })
        } catch (error) {
            console.log('get list events failed:', error.message)
            return false
        }
    },

    updateEvent: async (id, formData) => {
        try {
            const response = await apiInstance.put(`/api/staff-event/update-event/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('update list events failed:', error.message)
            return false
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await apiInstance.delete(`/api/staff-event/delete-event/${id}`)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('delete events failed:', error.message)
            return false
        }
    }
}))