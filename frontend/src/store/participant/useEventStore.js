import { create } from "zustand"
import toast from "react-hot-toast"
import { currentInterest, createInterestUser, updateInterest, matchedEvent, registerEvent } from "../../services/participant/eventService.js"

export const useEventStore = create((set) => ({
    interest: [],
    hasInterests: false,
    matchedEvents: [],

    checkInterest: async () => {
        try {
            const response = await currentInterest()
            if(!response.success) { return false, set({ interest: [], hasInterests: false }) }
            set({ interest: response.interest })
            set({ interest: response.interest || [], hasInterest: response.hasInterest })
            return response.hasInterest
        } catch (error) {
            console.log('check interest store failed:', error.message)
            set({ interest: null })
            return false
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
            return true
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
            return true
        } catch (error) {
            console.log('update interest store failed:', error.message)
            return false
        }
    },

    getMatchEvent: async () => {
        try {
            const response = await matchedEvent()
            if(!response.success) {
                console.log('matched Event failed to fetch')
                set({ matchedEvents: null })
                return false
            }

            return set({ matchedEvents: response.events })
        } catch (error) {
            console.log('get matched event failed:', error.message)
            set({ matchedEvents: null })
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
    }
}))