import { create } from "zustand";
import { enableOrDisableFunds, enableOrDisableGoods, verifyPaymentCancellation, getEventGoodsTypes } from "../../services/donation/donationService.js";
import toast from "react-hot-toast";

export const useDonationStore = create((set) => ({

    enableOrDisableFundsEventDonation: async (id, funds) => {
        try {
            const response = await enableOrDisableFunds(id, funds)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('enable or disable funds donation failed:', error.message)
        }
    },

    enableOrDisableGoodsEventDonation: async (id, goods) => {
        try {
            const response = await enableOrDisableGoods(id, goods)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('enable or disable goods donation failed:', error.message)
        }
    },

    verifyPaymentCancellation: async (donationId) => {
        try {
            const response = await verifyPaymentCancellation(donationId)
            if(!response.success) {
                toast.error(response.message || 'Failed to verify payment cancellation')
                return { success: false, isCancelled: false }
            }

            return {
                success: true,
                isCancelled: response.isCancelled,
                paymentStatus: response.paymentStatus,
                message: response.message
            }
        } catch (error) {
            console.log('verify payment cancellation store failed:', error.message)
            toast.error('Failed to verify payment cancellation')
            return { success: false, isCancelled: false }
        }
    },

    getEventGoodsTypes: async (eventId) => {
        try {
            const response = await getEventGoodsTypes(eventId)
            if(!response.success) {
                console.log('getEventGoodsTypes failed:', response.message)
                return { success: false, data: [] }
            }

            return {
                success: true,
                data: response.data || []
            }
        } catch (error) {
            console.log('getEventGoodsTypes store failed:', error.message)
            return { success: false, data: [] }
        }
    }
}))