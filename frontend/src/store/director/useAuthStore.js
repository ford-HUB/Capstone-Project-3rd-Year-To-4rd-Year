import { create } from "zustand"
import toast from "react-hot-toast"
import { loginUser, logoutUser, currentUser } from "../../services/director/authService.js"

export const useAuthStore = create((set) => ({
    authenticatedDirector: null,

    login: async (formData) => {
        try {
            const response = await loginUser(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('login director store failed:', error.message)
            return false
        }  
    },

    logout: async () => {
        try {
            const response = await logoutUser()
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('logout director store failed:', error.message)
            return false
        }
    },

    checkAuth: async () => {
        try {
            const response = await currentUser()
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            set({ authenticatedDirector: response.user })
            return true 
        } catch (error) {
            console.log('director store auth failed:', error.message)
            return false
        }
    }

}))