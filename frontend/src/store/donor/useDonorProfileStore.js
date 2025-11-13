import { create } from "zustand"
import { getDonorProfile, updateDonorProfile, getDonorStats, changePassword } from "../../services/donor/profileService.js"
import toast from "react-hot-toast"

export const useDonorProfileStore = create((set, get) => ({
    profile: null,
    stats: null,
    loading: false,
    error: null,

    // Get donor profile
    fetchProfile: async () => {
        try {
            set({ loading: true, error: null })
            const response = await getDonorProfile()
            
            if (!response.success) {
                toast.error(response.message || 'Failed to fetch profile')
                set({ error: response.message, loading: false })
                return false
            }

            set({ profile: response.data, loading: false })
            return true
        } catch (error) {
            console.error('Fetch donor profile failed:', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile'
            toast.error(errorMessage)
            set({ error: errorMessage, loading: false })
            return false
        }
    },

    // Update donor profile
    updateProfile: async (profileData) => {
        try {
            set({ loading: true, error: null })
            const response = await updateDonorProfile(profileData)
            
            if (!response.success) {
                toast.error(response.message || 'Failed to update profile')
                set({ error: response.message, loading: false })
                return false
            }

            toast.success(response.message || 'Profile updated successfully')
            set({ profile: response.data, loading: false })
            return true
        } catch (error) {
            console.error('Update donor profile failed:', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile'
            toast.error(errorMessage)
            set({ error: errorMessage, loading: false })
            return false
        }
    },

    // Get donor statistics
    fetchStats: async () => {
        try {
            set({ loading: true, error: null })
            const response = await getDonorStats()
            
            if (!response.success) {
                toast.error(response.message || 'Failed to fetch statistics')
                set({ error: response.message, loading: false })
                return false
            }

            set({ stats: response.data, loading: false })
            return true
        } catch (error) {
            console.error('Fetch donor stats failed:', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch statistics'
            toast.error(errorMessage)
            set({ error: errorMessage, loading: false })
            return false
        }
    },

    // Clear profile data
    clearProfile: () => {
        set({ profile: null, stats: null, error: null })
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            set({ loading: true, error: null })
            const response = await changePassword(passwordData)
            
            if (!response.success) {
                toast.error(response.message || 'Failed to change password')
                set({ error: response.message, loading: false })
                return false
            }

            toast.success(response.message || 'Password changed successfully')
            set({ loading: false })
            return true
        } catch (error) {
            console.error('Change password failed:', error.message)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to change password'
            toast.error(errorMessage)
            set({ error: errorMessage, loading: false })
            return false
        }
    }
}))

// Computed selector: Check if account is OAuth (not from our system)
export const useIsOAuthAccount = () => {
    const profile = useDonorProfileStore((state) => state.profile);
    return profile?.auth_provider && profile.auth_provider !== 'local';
}