import { apiInstance } from '../../api/_base.js';

// Create testimonial
export const createTestimonial = async (testimonialData) => {
    try {
        const response = await apiInstance.post('/api/testimonial/create', testimonialData);
        return response.data;
    } catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
    }
};

// Get testimonials
export const getTestimonials = async () => {
    try {
        const response = await apiInstance.get('/api/testimonial');
        return response.data;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
    }
};

