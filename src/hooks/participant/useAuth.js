import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useAuth = create((set) => ({
    user: null,

        signup: async (formData) => {
        try {
            const response = await apiInstance.post('/api/user-auth/user-signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            })

            if (!response.data.success) { toast.error(response.data.message); return false }
            toast.success(response.data.message);
            return true;
    } catch (error) {
        console.error('Signup failed:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        toast.error(errorMessage);
        return false;
    }
    },

    login: async (formData) => {
        try {
            const response = await apiInstance.post('/user-login', formData)
            if(!response.data.success) { return false, toast.error(response.data.message) }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('login hooks in participant failed', error.message)
            return false
        }
    }
}))