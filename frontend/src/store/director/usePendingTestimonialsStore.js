import { create } from "zustand";
import toast from "react-hot-toast";
import { getPendingTestimonials as getPendingTestimonialsService, approveTestimonial as approveTestimonialService, deleteTestimonial as deleteTestimonialService } from "../../services/director/testimonialService.js";

export const usePendingTestimonialsStore = create((set) => ({
    testimonials: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    isLoading: false,
    isApproving: null,
    isDeleting: null,
    error: null,

    getPendingTestimonials: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getPendingTestimonialsService(page, limit);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch pending testimonials');
            }

            set({ 
                testimonials: response.testimonials || [],
                pagination: response.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                },
                isLoading: false,
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[Director Store] Get pending testimonials failed:', error.message);
            set({ 
                testimonials: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                },
                isLoading: false,
                error: error.message 
            });
            toast.error('Failed to load pending testimonials');
            return false;
        }
    },

    approveTestimonial: async (testimonialId) => {
        set({ isApproving: testimonialId });
        try {
            const response = await approveTestimonialService(testimonialId);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to approve testimonial');
            }

            // Remove the approved testimonial from the list
            set(state => ({
                testimonials: state.testimonials.filter(
                    testimonial => testimonial.testimonial_id !== testimonialId
                ),
                pagination: {
                    ...state.pagination,
                    totalItems: state.pagination.totalItems - 1
                },
                isApproving: null
            }));

            toast.success('Testimonial approved successfully');
            return true;

        } catch (error) {
            console.error('Approve testimonial failed:', error.message);
            set({ isApproving: null });
            toast.error(error.response?.data?.message || 'Failed to approve testimonial');
            return false;
        }
    },

    deleteTestimonial: async (testimonialId) => {
        set({ isDeleting: testimonialId });
        try {
            const response = await deleteTestimonialService(testimonialId);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete testimonial');
            }

            set(state => ({
                testimonials: state.testimonials.filter(
                    testimonial => testimonial.testimonial_id !== testimonialId
                ),
                pagination: {
                    ...state.pagination,
                    totalItems: state.pagination.totalItems - 1
                },
                isDeleting: null
            }));

            toast.success('Testimonial deleted successfully');
            return true;

        } catch (error) {
            console.error('Delete testimonial failed:', error.message);
            set({ isDeleting: null });
            toast.error(error.response?.data?.message || 'Failed to delete testimonial');
            return false;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        testimonials: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10
        },
        isLoading: false,
        isApproving: null,
        isDeleting: null,
        error: null 
    })
}));

