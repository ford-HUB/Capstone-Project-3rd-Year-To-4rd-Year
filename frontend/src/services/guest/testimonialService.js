import { apiInstance } from '../../api/_base.js';

export const getFeaturedTestimonials = async () => {
    const response = await apiInstance.get('/api/testimonial', {
        params: { approved: true, featured: true }
    });
    return response.data;
};

export const getTestimonialsStatistics = async () => {
    const response = await apiInstance.get('/api/testimonial', {
        params: { approved: true }
    });
    return response.data;
};

