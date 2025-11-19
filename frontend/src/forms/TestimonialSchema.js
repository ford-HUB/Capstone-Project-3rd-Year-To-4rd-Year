import { z } from 'zod';

export const testimonialSchema = z.object({
    rating: z.number().min(1, { message: 'Rating is required.' }).max(5),
    message: z.string()
        .min(1, { message: 'Message is required.' })
        .min(10, { message: 'Message must be at least 10 characters.' })
        .max(1000, { message: 'Message must not exceed 1000 characters.' })
});

