import { create } from "zustand";
import { fetchVolunteers } from "../../services/common/volunteerService.js";

export const useVolunteerStore = create((set) => {

    return {
        volunteers: [],
        loading: false,
        error: null,

        fetchVolunteers: async () => {
            set({ loading: true, error: null })
            try {
                const response = await fetchVolunteers()
                if (!response.success) {
                    console.log(response.message)
                    set({ loading: false, error: response.message })
                    return false
                }
                set({ volunteers: response.volunteers, loading: false })
                return true;
            } catch (error) {
                console.log("fetching volunteers failed:", error.message)
                set({ loading: false, error: error.message })
                return false
            }finally {
                set({ loading: false })
            }
        }
    }
})

