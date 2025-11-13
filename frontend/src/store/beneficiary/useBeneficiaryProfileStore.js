import { create } from 'zustand';
import {
    getBeneficiaryProfile,
    updateBeneficiaryProfile,
    uploadBeneficiaryProfileImage,
    deleteBeneficiaryProfile,
    updateBeneficiaryEmail,
} from '../../services/beneficiary/profileService.js';
import toast from 'react-hot-toast';
import { useVerificationStore } from '../participant/useVerificationStore.js';

export const useBeneficiaryProfileStore = create((set) => ({
    currentProfileInfo: null,
    isLoading: false,
    error: null,

    getCurrentProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await getBeneficiaryProfile();
            if (!response.success) {
                set({ 
                    currentProfileInfo: null, 
                    isLoading: false, 
                    error: 'Failed to fetch beneficiary profile' 
                });
                console.log('Failed to fetch beneficiary profile');
                return false;
            }

            set({ 
                currentProfileInfo: response.beneficiaryData, 
                isLoading: false, 
                error: null 
            });
            console.log('Beneficiary profile data stored:', response.beneficiaryData);
            return true;
        } catch (error) {
            set({ 
                isLoading: false, 
                error: error.message || 'Failed to fetch profile' 
            });
            console.log(
                'Fetch current beneficiary profile failed:',
                error.message
            );
            return false;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await updateBeneficiaryProfile(profileData);
            if (!response.success) {
                toast.error(response.message || 'Failed to update profile');
                return false;
            }

            set({ currentProfileInfo: response.data });
            toast.success(response.message || 'Profile updated successfully');
            return true;
        } catch (error) {
            console.log('Update beneficiary profile failed:', error.message);
            toast.error('Failed to update profile');
            return false;
        }
    },

    uploadProfileImage: async (imageFile) => {
        try {
            const response = await uploadBeneficiaryProfileImage(imageFile);
            if (!response.success) {
                toast.error(response.message || 'Failed to upload image');
                return false;
            }

            toast.success('Profile image uploaded successfully');
            return true;
        } catch (error) {
            console.log('Upload profile image failed:', error.message);
            toast.error('Failed to upload image');
            return false;
        }
    },

    deleteProfile: async () => {
        try {
            const response = await deleteBeneficiaryProfile();
            if (!response.success) {
                toast.error(response.message || 'Failed to delete profile');
                return false;
            }

            set({ currentProfileInfo: null });
            toast.success('Profile deleted successfully');
            return true;
        } catch (error) {
            console.log('Delete beneficiary profile failed:', error.message);
            toast.error('Failed to delete profile');
            return false;
        }
    },

    updateEmail: async (emailData) => {
        try {
            const { setExpiresAt } = useVerificationStore.getState()
            const response = await updateBeneficiaryEmail(emailData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }

            toast.success(response.message);
            await setExpiresAt(response.otp_expiration)
            return true
        } catch (error) {
            console.log('Update beneficiary email failed:', error.message);
            toast.error('Failed to update email');
            return false;
        }
    },

    clearProfile: () => {
        set({ currentProfileInfo: null, error: null });
    },

    setProfile: (profile) => {
        set({ currentProfileInfo: profile });
    },
}));
