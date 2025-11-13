import { z } from 'zod';

export const formLinkSchema = z.object({
    event_id: z
        .string()
        .min(1, { message: 'Please select an event.' })
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Please select a valid event.'
        }),

    target_role: z
        .enum(['volunteer', 'beneficiary'], {
            required_error: 'Please select a target role.',
            invalid_type_error: 'Target role must be either volunteer or beneficiary.'
        }),

    title: z
        .string()
        .min(1, { message: 'Form title is required.' })
        .min(3, { message: 'Form title must be at least 3 characters long.' })
        .max(255, { message: 'Form title must not exceed 255 characters.' }),

    description: z
        .string()
        .min(1, { message: 'Form description is required.' })
        .min(10, { message: 'Form description must be at least 10 characters long.' })
        .max(1000, { message: 'Form description must not exceed 1000 characters.' }),

    form_link: z
        .string()
        .min(1, { message: 'Google Form link is required.' })
        .url({ message: 'Please provide a valid URL.' })
        .refine((url) => {
            try {
                const urlObj = new URL(url);
                return urlObj.hostname === 'docs.google.com' && 
                       urlObj.pathname.includes('/forms/') && 
                       (urlObj.pathname.includes('/d/') || urlObj.pathname.includes('/edit'));
            } catch {
                return false;
            }
        }, { message: 'Please provide a valid Google Form URL (https://docs.google.com/forms/d/...).' }),

    sheet_link: z
        .string()
        .optional()
        .refine((url) => {
            if (!url || url.trim() === '') return true; // Allow empty string
            try {
                const urlObj = new URL(url);
                return urlObj.hostname === 'docs.google.com' && 
                       urlObj.pathname.includes('/spreadsheets/') && 
                       (urlObj.pathname.includes('/d/') || urlObj.pathname.includes('/edit'));
            } catch {
                return false;
            }
        }, { message: 'Please provide a valid Google Sheets URL (https://docs.google.com/spreadsheets/d/...).' })
});

// Step-by-step validation schemas
export const stepSchemas = {
    step1: z.object({
        event_id: z
            .string()
            .min(1, { message: 'Please select an event.' })
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
                message: 'Please select a valid event.'
            })
    }),

    step2: z.object({
        target_role: z
            .enum(['volunteer', 'beneficiary'], {
                required_error: 'Please select a target role.',
                invalid_type_error: 'Target role must be either volunteer or beneficiary.'
            })
    }),

    step3: z.object({
        title: z
            .string()
            .min(1, { message: 'Form title is required.' })
            .min(3, { message: 'Form title must be at least 3 characters long.' })
            .max(255, { message: 'Form title must not exceed 255 characters.' }),

        description: z
            .string()
            .min(1, { message: 'Form description is required.' })
            .min(10, { message: 'Form description must be at least 10 characters long.' })
            .max(1000, { message: 'Form description must not exceed 1000 characters.' })
    }),

    step4: z.object({
        form_link: z
            .string()
            .min(1, { message: 'Google Form link is required.' })
            .url({ message: 'Please provide a valid URL.' })
            .refine((url) => {
                try {
                    const urlObj = new URL(url);
                    return urlObj.hostname === 'docs.google.com' && 
                           urlObj.pathname.includes('/forms/') && 
                           (urlObj.pathname.includes('/d/') || urlObj.pathname.includes('/edit'));
                } catch {
                    return false;
                }
            }, { message: 'Please provide a valid Google Form URL (https://docs.google.com/forms/d/...).' }),

        sheet_link: z
            .string()
            .optional()
            .refine((url) => {
                if (!url || url.trim() === '') return true; // Allow empty string
                try {
                    const urlObj = new URL(url);
                    return urlObj.hostname === 'docs.google.com' && 
                           urlObj.pathname.includes('/spreadsheets/') && 
                           (urlObj.pathname.includes('/d/') || urlObj.pathname.includes('/edit'));
                } catch {
                    return false;
                }
            }, { message: 'Please provide a valid Google Sheets URL (https://docs.google.com/spreadsheets/d/...).' })
    }),

    step5: z.object({
        // Step 5 is review, no additional validation needed
    })
};

export default formLinkSchema;
