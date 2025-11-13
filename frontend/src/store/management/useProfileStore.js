import { create } from "zustand";
import toast from "react-hot-toast";
import { getCurrentProfile, insertPersonInfo, insertPersonAddress, updateEmailAvatar, updatePasswordUser, updateSignature } from "../../services/management/profileService.js";

export const useProfileStore = create((set) => ({
    managementCurrentProfile: [],

    currentProfile: async () => {
        try {
            const response = await getCurrentProfile()
            if(!response.success) return false
            
            set({ managementCurrentProfile: response.profileInfo })
            return true
        } catch (error) {
            console.log('current info management failed:', error.message)
        }
    },

    insertOrUpdateProfileInfo: async (formData) => {
        try {
            const response = await insertPersonInfo(formData)
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
            const response = await insertPersonAddress(formData)
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
            const response = await updateEmailAvatar(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update email or avatar failed: ', error.message)
        }
    },

    updatePassword: async (newPassword) => {
        try {
            const response = await updatePasswordUser(newPassword)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update password failed: ', error.message)
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
            console.log('update signature management failed: ', error.message)
        }
    }
}))