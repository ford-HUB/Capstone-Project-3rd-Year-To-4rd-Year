import { apiInstance } from '../../api/_base.js';

// Submit beneficiary event evaluation
export const submitBeneficiaryEventEvaluation = async (eventId, evaluationData) => {
    try {
        const response = await apiInstance.post(`/api/beneficiary-evaluation/${eventId}/beneficiary/evaluation`, evaluationData);
        return response.data;
    } catch (error) {
        console.error('Error submitting beneficiary evaluation:', error);
        throw error;
    }
};

// Get beneficiary evaluation form schema
export const getBeneficiaryEvaluationForm = async (eventId) => {
    try {
        const response = await apiInstance.get(`/api/beneficiary-evaluation/${eventId}/form`);
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary evaluation form:', error);
        throw error;
    }
};

// Get all beneficiary evaluations (admin only)
export const getAllBeneficiaryEvaluations = async () => {
    try {
        const response = await apiInstance.get('/api/beneficiary-evaluation/admin/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary evaluations:', error);
        throw error;
    }
};

// Get beneficiary evaluations for a specific event (admin only)
export const getBeneficiaryEvaluationsByEvent = async (eventId) => {
    try {
        const response = await apiInstance.get(`/api/beneficiary-evaluation/admin/event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary evaluations by event:', error);
        throw error;
    }
};
