import { apiInstance } from "../../api/_base.js";

// Get all evaluation submissions for admin
export const getAllEventEvaluations = async () => {
    const response = await apiInstance.get('/api/event-evaluation/admin/all');
    return {
        success: response.data.success,
        evaluations: response.data.evaluations
    };
};

// Get evaluation submissions for a specific event
export const getEventEvaluationsByEvent = async (eventId) => {
    const response = await apiInstance.get(`/api/event-evaluation/admin/event/${eventId}`);
    return {
        success: response.data.success,
        evaluations: response.data.evaluations
    };
};
