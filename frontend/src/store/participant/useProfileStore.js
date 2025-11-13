import { create } from "zustand"
import { currentUserProfile, undoEmailChanges, updateAccountEmail, updateUserProfile } from "../../services/participant/profileService.js"
import { useVerificationStore } from "./useVerificationStore.js"
import toast from "react-hot-toast"

export const useProfileStore = create((set) => ({
    currentProfileInfo: null,

    getCurrentProfile: async () => {
        try {
            const response = await currentUserProfile()
            if(!response.success) {
                set({ currentProfileInfo: null })
                console.log('failed to fetch')
                return false
            }

            set({ currentProfileInfo: response.profile })
            console.log('Profile data stored:', response.profile) // Log here
            return true
        } catch (error) {
            console.log('fetch current profile failed: ', error.message)
        }
    },

    updateProfile: async (formData) => {
        try {
            const response = await updateUserProfile(formData)
            if(!response.success) {
                toast.error(response.message || 'failed')
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('update profile failed: ', error.message)
        }
    },

    updateEmail: async (formData) => {
        try {
            const { setExpiresAt } = useVerificationStore.getState()
            const response = await updateAccountEmail(formData)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            await setExpiresAt(response.otp_expiration)
            return true
        } catch (error) {
            console.log('update email failed: ', error.message)
        }
    },

    undoEmailChanges: async () => {
        try {
            const response = await undoEmailChanges()
            if(!response.success) {
                return false
            }
            return true
        } catch (error) {
            console.log('undo email changes failed: ', error.message)
        }
    }
}))