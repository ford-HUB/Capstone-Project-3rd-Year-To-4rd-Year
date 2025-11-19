import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    createTestimonial,
    getTestimonials
} from "../../services/beneficiary/testimonialService.js";

export const useTestimonialStore = create((set, get) => ({
    // State
    isSubmitting: false,
    isLoading: false,
    error: null,
    success: false,
    testimonials: [],

    // Create testimonial
    submitTestimonial: async (testimonialData) => {
        set({ isSubmitting: true, error: null, success: false });
        
        try {
            const response = await createTestimonial(testimonialData);
            
            if (response.success) {
                set({ success: true, error: null });
                toast.success(response.message || 'Thank you! Your testimonial has been submitted successfully.');
                return { success: true, message: response.message, testimonial: response.testimonial };
            } else {
                set({ error: response.message, success: false });
                toast.error(response.message || 'Failed to submit testimonial. Please try again.');
                return { success: false, message: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit testimonial. Please try again.';
            set({ error: errorMessage, success: false });
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            set({ isSubmitting: false });
        }
    },

    // Get testimonials
    fetchTestimonials: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await getTestimonials();
            
            if (response.success) {
                set({ testimonials: response.testimonials || [], error: null });
                return { success: true, testimonials: response.testimonials || [] };
            } else {
                set({ error: response.message, testimonials: [] });
                return { success: false, message: response.message, testimonials: [] };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch testimonials.';
            set({ error: errorMessage, testimonials: [] });
            return { success: false, message: errorMessage, testimonials: [] };
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear state
    clearState: () => {
        set({ 
            isSubmitting: false, 
            isLoading: false, 
            error: null, 
            success: false 
        });
    },

    // Reset success state
    resetSuccess: () => {
        set({ success: false });
    }
}));

