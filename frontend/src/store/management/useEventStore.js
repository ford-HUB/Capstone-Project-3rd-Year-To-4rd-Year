import { create } from "zustand";
import { registerManagementEvent, unRegisterEventManagement } from "../../services/management/eventService.js";
import toast from "react-hot-toast";

export const useEventStore = create((set) => ({

    registerManagementEvent: async (event_id) => {
        try {
            const response = await registerManagementEvent(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('register management event failed:', error.message)
        }
    },

    unRegisterEventManagement: async (event_id) => {
        try {
            const response = await unRegisterEventManagement(event_id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('unregister management failed: ', error.message)
        }
    }
}))