import { create } from "zustand";
import { enableOrDisableFunds, enableOrDisableGoods } from "../../services/donation/donationService.js";
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
    }
}))