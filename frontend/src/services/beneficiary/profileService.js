import { apiInstance } from "../../api/_base.js";

export const getBeneficiaryProfile = async () => {
    try {
        const response = await apiInstance.get('/api/beneficiary/profile');
        return {
            success: response.data.success,
            beneficiaryData: response.data.beneficiaryData
        }
    } catch (error) {
        console.error('Get beneficiary profile error:', error);
        throw error;
    }
};

export const updateBeneficiaryProfile = async (profileData) => {
    try {
        const response = await apiInstance.put('/api/beneficiary/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Update beneficiary profile error:', error);
        throw error;
    }
};

export const uploadBeneficiaryProfileImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        
        const response = await apiInstance.post('/api/beneficiary/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload beneficiary profile image error:', error);
        throw error;
    }
};

export const updateBeneficiaryEmail = async (emailData) => {
    try {
        const response = await apiInstance.put('/api/beneficiary/profile/email', emailData);
        return response.data;
    } catch (error) {
        console.error('Update beneficiary email error:', error);
        throw error;
    }
};

export const deleteBeneficiaryProfile = async () => {
    try {
        const response = await apiInstance.delete('/api/beneficiary/profile');
        return response.data;
    } catch (error) {
        console.error('Delete beneficiary profile error:', error);
        throw error;
    }
};