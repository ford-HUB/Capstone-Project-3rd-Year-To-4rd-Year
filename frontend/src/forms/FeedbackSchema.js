import { z } from 'zod';

export const eventEvaluationSchema = z.object({
    overallRating: z
        .number({ required_error: 'Overall rating is required.' })
        .min(1, { message: 'Overall rating must be at least 1.' })
        .max(5, { message: 'Overall rating must not exceed 5.' }),

    contentQuality: z
        .number({ required_error: 'Content quality rating is required.' })
        .min(1, { message: 'Content quality must be at least 1.' })
        .max(5, { message: 'Content quality must not exceed 5.' }),

    organizationRating: z
        .number({ required_error: 'Organization rating is required.' })
        .min(1, { message: 'Organization rating must be at least 1.' })
        .max(5, { message: 'Organization rating must not exceed 5.' }),

    venueRating: z
        .number({ required_error: 'Venue rating is required.' })
        .min(1, { message: 'Venue rating must be at least 1.' })
        .max(5, { message: 'Venue rating must not exceed 5.' }),

    mostValuable: z.string().optional(),
    leastValuable: z.string().optional(),
    suggestions: z.string().optional(),

    guidanceDuringEvent: z
        .number({ required_error: 'Guidance & support rating is required.' })
        .min(1, { message: 'Guidance & support rating must be at least 1.' })
        .max(5, { message: 'Guidance & support rating must not exceed 5.' }),

    communicationRating: z
        .number({ required_error: 'Communication rating is required.' })
        .min(1, { message: 'Communication rating must be at least 1.' })
        .max(5, { message: 'Communication rating must not exceed 5.' }),

    recommendEvent: z.enum(
        ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
        { required_error: 'Please choose one of the options that we provided.' }
    ),

    futureTopics: z.string().optional(),

    futureParticipation: z.enum(
        ['Yes, definitely', 'Yes, probably', 'Maybe', 'Probably not', 'No'],
        { required_error: 'Please choose one of the options that we provided' }
    ),

    additionalComments: z.string().optional(),

    shareTestimonial: z.boolean().optional(),
});
