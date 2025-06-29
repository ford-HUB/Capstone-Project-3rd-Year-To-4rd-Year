import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"

export const useApprovalsHooks = create((set) => ({
    listApprovals: [],

    getRequestList: async () => {
        try {
            const response = await apiInstance.get('/api/director-manage/list-request-approvals')
            if(!response.data.success) {
                return false
            }
            
            set({ listApprovals: response.data.list })
            return true
        } catch (error) {
            console.log('get request approval failed:', error.message)
            return false
        }
    },

    approvedRequest: async (id) => {
        try {
            const response = await apiInstance.put(`/api/director-manage/set-approved-request/${id}`)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('approved request failed:', error.message)
            return false
        }
    },

    rejectRequest: async (id) => {
        try {
            const response = await apiInstance.put(`/api/director-manage/reject-request/${id}`)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('reject request failed:', error.message)
            return false
        }
    },

    deleteRequest: async (id) => {
        try {
            const response = await apiInstance.put(`/api/director-manage/delete-request/${id}`)
            if(!response.data.success) {
                toast.error(response.data.message)
                return false
            }
            toast.success(response.data.message)
            return true
        } catch (error) {
            console.log('delete request failed:', error.message)
            return false
        }
    }

    
}))