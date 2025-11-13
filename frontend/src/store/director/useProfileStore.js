import { create } from "zustand";
import { getCurrentProfile, insertPersonalInfo, insertAddress, updateSigningEmail, updatePassword, updateSignature } from "../../services/director/profileService.js";
import toast from "react-hot-toast";

export const useProfileStore = create((set) => ({
    currentDirectorInfo: {},
    currentPaymentInfo: [],

    currentProfile: async (formData) => {
        try {
            const response = await getCurrentProfile(formData)
            if(!response.success) return false
            set({ currentDirectorInfo: response.directorInfo || {} })
            set({ currentPaymentInfo: response.paymentInfo || [] })
            return true
        } catch (error) {
            console.log('get current profile failed: ', error.message)
        }
    },

    insertOrUpdateProfileInfo: async (formData) => {
        try {
            const response = await insertPersonalInfo(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('insert profile info failed: ', error.message)
        }
    },

    insertOrUpdateProfileAddress: async (formData) => {
        try {
            const response = await insertAddress(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true

        } catch (error) {
            console.log('profile address failed: ', error.message)
        }
    },

    updateEmailOrAvatar: async (formData) => {
        try {
            const response = await updateSigningEmail(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update email failed: ', error.message)
        }
    },

    updatePassword: async (formData) => {
        try {
            const response = await updatePassword(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update password director failed: ', error.message)
        }
    },

    updateSignature: async (formData) => {
        try {
            const response = await updateSignature(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update signature director failed: ', error.message)
        }
    }
}))