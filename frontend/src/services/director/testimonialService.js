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

