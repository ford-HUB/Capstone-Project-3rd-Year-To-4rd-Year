import { apiInstance } from '../../api/_base.js';

export const getPendingTestimonials = async (page = 1, limit = 10) => {
    const response = await apiInstance.get('/api/testimonial/pending', {
        params: { page, limit }
    });
    return response.data;
};

export const approveTestimonial = async (testimonial_id) => {
    const response = await apiInstance.patch(`/api/testimonial/${testimonial_id}/approve`);
    return response.data;
};

export const deleteTestimonial = async (testimonial_id) => {
    const response = await apiInstance.delete(`/api/testimonial/${testimonial_id}`);
    return response.data;
};

export const getAllApprovedTestimonials = async (page = 1, limit = 10) => {
    const response = await apiInstance.get('/api/testimonial/all', {
        params: { page, limit }
    });
    return response.data;
};

export const toggleFeatured = async (testimonial_id, featured) => {
    const response = await apiInstance.patch(`/api/testimonial/${testimonial_id}/featured`, {
        featured
    });
    return response.data;
};

