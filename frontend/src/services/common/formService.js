import { apiInstance } from "../../api/_base.js";

export const createForm = async (formData) => {
    const response = await apiInstance.post('/api/form', formData);
    return {
        success: response.data.success,
        message: response.data.message,
        form: response.data.form
    };
};

export const getForms = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await apiInstance.get(`/api/form?${queryParams}`);
    return {
        success: response.data.success,
        message: response.data.message,
        forms: response.data.forms
    };
};

export const getFormById = async (formId) => {
    const response = await apiInstance.get(`/api/form/${formId}`);
    return {
        success: response.data.success,
        message: response.data.message,
        form: response.data.form
    };
};

export const updateForm = async (formId, formData) => {
    const response = await apiInstance.put(`/api/form/${formId}`, formData);
    return {
        success: response.data.success,
        message: response.data.message,
        form: response.data.form
    };
};

export const deleteForm = async (formId) => {
    const response = await apiInstance.delete(`/api/form/${formId}`);
    return {
        success: response.data.success,
        message: response.data.message
    };
};

export const submitFormResponse = async (formId, responseData, participantType = 'beneficiary') => {
    const response = await apiInstance.post(`/api/form/${formId}/submit`, {
        response_data: responseData,
        participant_type: participantType
    });
    return {
        success: response.data.success,
        message: response.data.message,
        response: response.data.response
    };
};

// Submit multiple form responses for event evaluation
export const submitEventFormResponses = async (formResponses) => {
    console.group("🌐 Service: submitEventFormResponses");
    console.log("📤 Sending form responses to backend:", formResponses);
    
    try {
        const response = await apiInstance.post('/api/form/submit-multiple', {
            form_responses: formResponses
        });
        
        console.log("📡 Backend response:", response.data);
        
        const result = {
            success: response.data.success,
            message: response.data.message,
            responses: response.data.responses
        };
        
        console.log("✅ Service result:", result);
        console.groupEnd();
        return result;
    } catch (error) {
        console.error("🚨 Service error:", error);
        console.error("🚨 Error response:", error.response?.data);
        console.groupEnd();
        throw error;
    }
};

export const getFormResponses = async (formId) => {
    const response = await apiInstance.get(`/api/form/${formId}/responses`);
    return {
        success: response.data.success,
        message: response.data.message,
        responses: response.data.responses
    };
};

export const getCategories = async () => {
    const response = await apiInstance.get('/api/form/categories');
    return {
        success: response.data.success,
        message: response.data.message,
        categories: response.data.categories
    };
};

export const getEvents = async () => {
    const response = await apiInstance.get('/api/form/events');
    return {
        success: response.data.success,
        message: response.data.message,
        events: response.data.events
    };
};

// Get events from v2 endpoint
export const getEventsV2 = async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.exclude_with_forms) {
        queryParams.append('exclude_with_forms', params.exclude_with_forms);
    }
    
    const url = `/api/form/v2/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
        const response = await apiInstance.get(url);
        
        return {
            success: response.data.success,
            message: response.data.message,
            events: response.data.events
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch events',
            events: []
        };
    }
};

// Get form link status for a specific event
export const getEventFormLinkStatus = async (eventId) => {
    const response = await apiInstance.get(`/api/form/v2/event/${eventId}/form-status`);
    return {
        success: response.data.success,
        message: response.data.message,
        event: response.data.event,
        status: response.data.status
    };
};

// Get forms for dynamic reflection based on category and event
export const getFormsForReflection = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    console.log('Fetching forms for reflection with params:', params);
    console.log('Query string:', queryParams);
    
    const response = await apiInstance.get(`/api/form/reflection?${queryParams}`);
    
    console.log('Forms reflection response:', response.data);
    
    return {
        success: response.data.success,
        message: response.data.message,
        forms: response.data.forms
    };
};

// Submit Google Form Link
export const submitEventGoogleFormLink = async (formData) => {
    try {
        const response = await apiInstance.post('/api/form/v2/submit-google-form', formData);
        
        return {
            success: response.data.success,
            message: response.data.message,
            formLink: response.data.formLink
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create form link',
            formLink: null
        };
    }
};

// Get Google Form Links with pagination and filtering
export const getGoogleFormLinks = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.target_role) queryParams.append('target_role', params.target_role);
        if (params.event_id) queryParams.append('event_id', params.event_id);
        
        const url = `/api/form/v2/google-form-links${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiInstance.get(url);
        
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch Google Form links',
            data: { formLinks: [], pagination: {} }
        };
    }
};

// Get single Google Form Link by ID
export const getGoogleFormLinkById = async (formlinkId) => {
    try {
        const response = await apiInstance.get(`/api/form/v2/google-form-links/${formlinkId}`);
        
        return {
            success: response.data.success,
            message: response.data.message,
            formLink: response.data.formLink
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch form link',
            formLink: null
        };
    }
};

// Update Google Form Link
export const updateGoogleFormLink = async (formlinkId, formData) => {
    try {
        const response = await apiInstance.put(`/api/form/v2/google-form-links/${formlinkId}`, formData);
        
        return {
            success: response.data.success,
            message: response.data.message,
            formLink: response.data.formLink
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update form link',
            formLink: null
        };
    }
};


// Delete Google Form Link
export const deleteGoogleFormLink = async (formlinkId) => {
    try {
        const response = await apiInstance.delete(`/api/form/v2/google-form-links/${formlinkId}`);
        
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete form link'
        };
    }
};