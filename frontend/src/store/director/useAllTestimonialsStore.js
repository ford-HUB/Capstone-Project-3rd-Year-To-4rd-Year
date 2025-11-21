import { create } from "zustand";
import toast from "react-hot-toast";
import { getAllApprovedTestimonials as getAllApprovedTestimonialsService, toggleFeatured as toggleFeaturedService } from "../../services/director/testimonialService.js";

export const useAllTestimonialsStore = create((set) => ({
    testimonials: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    isLoading: false,
    isToggling: null,
    error: null,

    getAllApprovedTestimonials: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAllApprovedTestimonialsService(page, limit);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch testimonials');
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
            console.error('[Director Store] Get all approved testimonials failed:', error.message);
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
            toast.error('Failed to load testimonials');
            return false;
        }
    },

    toggleFeatured: async (testimonialId, featured) => {
        set({ isToggling: testimonialId });
        try {
            const response = await toggleFeaturedService(testimonialId, featured);
            
            if (!response.success) {
                set({ isToggling: null });
                toast.error(response.message);
                return false;
            }

            set(state => ({
                testimonials: state.testimonials.map(testimonial =>
                    testimonial.testimonial_id === testimonialId
                        ? { ...testimonial, featured: response.testimonial.featured }
                        : testimonial
                ),
                isToggling: null
            }));

            toast.success(response.message);
            return true;

        } catch (error) {
            console.error('Toggle featured failed:', error.message);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle featured status';
            set({ isToggling: null });
            toast.error(errorMessage);
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
        isToggling: null,
        error: null 
    })
}));

