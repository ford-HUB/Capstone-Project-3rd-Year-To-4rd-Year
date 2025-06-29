import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useManageUsersHooks = create((set) => ({
    listUsers: null,

    getAllUsers: async () => {
        try {
            const response = await apiInstance.get('/api/director-manage-user/list-users')
            if(!response.data.success) {
                console.log(response.data.message)
                set({ listUsers: null })
                return false
            }

            set({ listUsers: response.data.list })
            return true

        } catch (error) {
            console.log('get all users failed:', error.message)
            set({ listUsers: null })
            return false
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await apiInstance.delete(`/api/director-manage-user/delete-user/${userId}`)
            if(!response.data.success) {
                toast.error('delete user failed')
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('delete user failed:', error.message)
            return false
        }
    }
}))