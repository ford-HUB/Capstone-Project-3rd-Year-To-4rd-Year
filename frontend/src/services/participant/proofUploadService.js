import { apiInstance } from "../../api/_base.js";

export const uploadEventProof = async (eventId, files) => {
    const formData = new FormData();
    
    // Append files to FormData
    files.forEach((file, index) => {
        formData.append('images', file);
    });

    const response = await apiInstance.post(`/api/event-proof/${eventId}/upload-proof`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};

export const getEventProofStatus = async (eventId) => {
    const response = await apiInstance.get(`/api/event-proof/${eventId}/proof-status`);
    
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};

export const markEvaluationCompleted = async (eventId) => {
    const response = await apiInstance.post(`/api/event-proof/${eventId}/mark-evaluation-completed`);
    
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};
