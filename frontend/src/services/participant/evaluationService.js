import { apiInstance } from "../../api/_base.js";

export const submitEventEvaluation = async (event_id, formData) => {
    if (!event_id) {
        throw new Error('Event ID is required for evaluation submission');
    }
    
    const url = `/api/event-evaluation/${event_id}/volunteer/feedback`;
    
    const response = await apiInstance.post(url, formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}