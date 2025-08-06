import { create } from "zustand"
import toast from "react-hot-toast"
import { currentRequestList, approveUser, deleteUser } from "../../services/director/approvalService.js"

export const useApprovalStore = create((set) => ({
    requestList: null,

    getRequestList: async () => {
        try {
            const response = await currentRequestList()
            if(!response.success) {
                return false
            }
            
            set({ requestList: response.requests })
            return true
        } catch (error) {
            console.log('get request list store failed:', error.message)
            return false
        }
    },

    approve: async (id) => {
        try {
            const response = await approveUser(id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            set(state => ({
                requestList: state.requestList.filter(req => req.ra_id !== id)
            }));
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('approved request store failed:', error.message)
            return false
        }
    },


    deleteRequest: async (id) => {
        try {
            const response = await deleteUser(id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            set(state => ({
                requestList: state.requestList.filter(req => req.ra_id !== id)
            }));
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('delete request store failed:', error.message)
            return false
        }
    }

    
}))