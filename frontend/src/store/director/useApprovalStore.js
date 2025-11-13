import { create } from "zustand"
import toast from "react-hot-toast"
import { currentRequestList, approveUser, rejectUser, getRejectedRequests, acceptRejectedRequest } from "../../services/director/approvalService.js"

export const useApprovalStore = create((set) => ({
    requestList: null,
    rejectedRequests: null,

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


    rejectRequest: async (id, reason) => {
        try {
            const response = await rejectUser(id, reason)
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
            console.log('reject request store failed:', error.message)
            return false
        }
    },

    getRejectedRequests: async () => {
        try {
            const response = await getRejectedRequests()
            if(!response.success) {
                set({ rejectedRequests: null })
                return false
            }
            set({ rejectedRequests: response.requests })
            return true
        } catch (error) {
            console.log('get rejected requests store failed:', error.message)
            set({ rejectedRequests: null })
            return false
        }
    },

    acceptRejectedRequest: async (id) => {
        try {
            const response = await acceptRejectedRequest(id)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            set(state => ({
                rejectedRequests: state.rejectedRequests.filter(req => req.ra_id !== id)
            }));
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('accept rejected request store failed:', error.message)
            return false
        }
    }

    
}))