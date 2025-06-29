import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useEvent = create((set) => ({
    interest: [],
    hasInterests: false,
    matchedEvents: [],

    checkInterest: async () => {
        try {
            const response = await apiInstance.get('/api/profile/check-interest')
            if(!response.data.success) { return false, set({ interest: [], hasInterests: false }) }
            set({ interest: response.data.listInterests })
            set({ interest: response.data.interests || [], hasInterests: response.data.hasInterests })

            return response.data.hasInterests
        } catch (error) {
            console.log('check interest failed:', error.message)
            set({ interest: null })
            return false
        }
    },

    addInterests: async (listInterest) => {
        try {
            const response = await apiInstance.post('/api/profile/add-interest', { interest: listInterest })
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('add interest failed:', error.message)
            return false
        }
    },

    updateInterest: async (updatedInterest) => {
        try {
            const response = await apiInstance.put('/api/profile/update-interest', { interest: updatedInterest })
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('update interest failed:', error.message)
            return false
        }
    },

    getMatchEvent: async () => {
        try {
            const response = await apiInstance.get('/api/ai/matched-events')
            if(!response.data.success) {
                console.log('matched Event failed to fetch')
                set({ matchedEvents: null })
                return false
            }

            return set({ matchedEvents: response.data.matched })

        } catch (error) {
            console.log('get matched event failed:', error.message)
            set({ matchedEvents: null })
            return false
        }
    },

    register_event: async (eventId, formData) => {
        try {
            const response = await apiInstance.post(`/api/participate/register-event/${eventId}`, formData)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }

            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('register event failed:', error.message)
            return false
        }
    }
}))