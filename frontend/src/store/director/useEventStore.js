import { create } from "zustand";
import { registerEventDirector, unRegisterEventDirector } from "../../services/director/eventService.js";
import toast from "react-hot-toast";

export const useEventStore = create((set) => ({

    registerEventDirector: async (event_id) => {
        try {
            const response = await registerEventDirector(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('register event failed: ', error.message)
        }
    },

    unRegisterEventDirector: async (event_id) => {
        try {
            const response = await unRegisterEventDirector(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('unregister event failed: ', error.message)
        }
    }
}))