import { z } from 'zod';

export const beneficiaryEvaluationSchema = z.object({
    // Static star ratings for beneficiary evaluation
    overallRating: z
        .number({ required_error: 'Overall rating is required.' })
        .min(1, { message: 'Overall rating must be at least 1.' })
        .max(5, { message: 'Overall rating must not exceed 5.' }),

    eventOrganization: z
        .number({ required_error: 'Event organization rating is required.' })
        .min(1, { message: 'Event organization rating must be at least 1.' })
        .max(5, { message: 'Event organization rating must not exceed 5.' }),

    venueQuality: z
        .number({ required_error: 'Venue quality rating is required.' })
        .min(1, { message: 'Venue quality rating must be at least 1.' })
        .max(5, { message: 'Venue quality rating must not exceed 5.' }),

    staffSupport: z
        .number({ required_error: 'Staff support rating is required.' })
        .min(1, { message: 'Staff support rating must be at least 1.' })
        .max(5, { message: 'Staff support rating must not exceed 5.' }),

    eventContent: z
        .number({ required_error: 'Event content rating is required.' })
        .min(1, { message: 'Event content rating must be at least 1.' })
        .max(5, { message: 'Event content rating must not exceed 5.' }),

    // Static text fields
    mostHelpful: z.string().optional(),
    leastHelpful: z.string().optional(),
    suggestions: z.string().optional(),

    // Static choice fields
    wouldRecommend: z.enum(
        ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
        { required_error: 'Please choose one of the options that we provided.' }
    ),

    futureParticipation: z.enum(
        ['Yes, definitely', 'Yes, probably', 'Maybe', 'Probably not', 'No'],
        { required_error: 'Please choose one of the options that we provided' }
    ),

    additionalComments: z.string().optional(),

    shareTestimonial: z.boolean().optional(),
});
