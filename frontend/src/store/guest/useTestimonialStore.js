import { create } from "zustand";
import { getFeaturedTestimonials as getFeaturedTestimonialsService, getTestimonialsStatistics as getTestimonialsStatisticsService, getBeneficiariesServedCount as getBeneficiariesServedCountService } from "../../services/guest/testimonialService.js";

export const useTestimonialStore = create((set) => ({
    featuredTestimonials: [],
    allTestimonials: [],
    statistics: {
        averageRating: 0,
        totalCount: 0,
        beneficiariesServed: 0
    },
    isLoading: false,
    error: null,

    getFeaturedTestimonials: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getFeaturedTestimonialsService();
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch featured testimonials');
            }

            set({ 
                featuredTestimonials: response.testimonials || [],
                isLoading: false,
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[Guest Store] Get featured testimonials failed:', error.message);
            set({ 
                featuredTestimonials: [],
                isLoading: false,
                error: error.message 
            });
            return false;
        }
    },

    getTestimonialsStatistics: async () => {
        try {
            const [testimonialsResponse, beneficiariesResponse] = await Promise.all([
                getTestimonialsStatisticsService(),
                getBeneficiariesServedCountService()
            ]);
            
            if (!testimonialsResponse.success) {
                throw new Error(testimonialsResponse.message || 'Failed to fetch testimonials statistics');
            }

            const testimonials = testimonialsResponse.testimonials || [];
            const totalCount = testimonials.length;
            const averageRating = totalCount > 0
                ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / totalCount
                : 0;

            const beneficiariesServed = beneficiariesResponse.success ? (beneficiariesResponse.count || 0) : 0;

            set({ 
                allTestimonials: testimonials,
                statistics: {
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalCount,
                    beneficiariesServed
                },
                error: null
            });
            
            return true;

        } catch (error) {
            console.error('[Guest Store] Get testimonials statistics failed:', error.message);
            set({ 
                statistics: {
                    averageRating: 0,
                    totalCount: 0,
                    beneficiariesServed: 0
                },
                error: error.message 
            });
            return false;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set({ 
        featuredTestimonials: [],
        allTestimonials: [],
        statistics: {
            averageRating: 0,
            totalCount: 0,
            beneficiariesServed: 0
        },
        isLoading: false,
        error: null 
    })
}));

