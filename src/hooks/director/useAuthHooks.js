import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useAuthHooks = create((set) => ({
    authenticatedDirector: null,

    login: async (formData) => {
        try {
            const response = await apiInstance.post('/api/director-auth/uclm-director-login', formData)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('login director hook failed:', error.message)
            return false
        }  
    },

    checkAuth: async () => {
        try {
            const response = await apiInstance.get('/api/director-auth/check-director-auth')
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            set({ authenticatedDirector: response.data.admin })
            return true 
        } catch (error) {
            console.log('director check auth failed:', error.message)
            return false
        }
    },

    logout: async () => {
        try {
            const response = await apiInstance.post('/api/director-auth/uclm-director-logout')
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('logout director failed:', error.message)
            return false
        }
    }
}))