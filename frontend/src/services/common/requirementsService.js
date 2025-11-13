import { apiInstance } from "../../api/_base.js";

// Create a new requirement
export const createRequirement = async (requirementData) => {
    const response = await apiInstance.post('/api/requirements/create', requirementData);
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};

// Get all requirements (for directors)
export const getAllRequirements = async () => {
    const response = await apiInstance.get('/api/requirements/all');
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};

// Get requirements for a specific role
export const getRequirementsForRole = async (role) => {
    try {
        const response = await apiInstance.get(`/api/requirements/role/${role}`);
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to fetch requirements',
            data: []
        };
    }
};

// Update a requirement
export const updateRequirement = async (id, requirementData) => {
    const response = await apiInstance.put(`/api/requirements/${id}`, requirementData);
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};

// Delete a requirement
export const deleteRequirement = async (id) => {
    const response = await apiInstance.delete(`/api/requirements/${id}`);
    return {
        success: response.data.success,
        message: response.data.message
    };
};

// Get requirement by ID
export const getRequirementById = async (id) => {
    const response = await apiInstance.get(`/api/requirements/${id}`);
    return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
    };
};
