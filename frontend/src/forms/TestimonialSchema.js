import { z } from 'zod';

export const testimonialSchema = z.object({
    rating: z.number().min(1, { message: 'Rating is required.' }).max(5),
    initials: z.string().optional()
});

