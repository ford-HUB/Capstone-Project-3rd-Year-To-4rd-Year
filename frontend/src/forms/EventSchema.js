import { z } from 'zod';

export const eventSchema = z
    .object({
        title: z
            .string({
                required_error: 'Event title is required',
                invalid_type_error: 'Event title must be a string',
            })
            .min(1, 'Event title cannot be empty')
            .min(3, 'Event title must be at least 3 characters long')
            .max(255, 'Event title must not exceed 255 characters')
            .trim(),

        description: z
            .string({
                required_error: 'Event description is required',
                invalid_type_error: 'Event description must be a string',
            })
            .min(1, 'Event description cannot be empty')
            .min(10, 'Event description must be at least 10 characters long')
            .max(2000, 'Event description must not exceed 2000 characters')
            .trim(),

        event_started: z.coerce.date({
            required_error: 'Start date and time is required',
            invalid_type_error: 'Start date and time must be a valid date',
        }),

        event_ended: z.coerce.date({
            required_error: 'End date and time is required',
            invalid_type_error: 'End date and time must be a valid date',
        }),

        location: z
            .string({
                required_error: 'Event location is required',
                invalid_type_error: 'Event location must be a string',
            })
            .min(1, 'Event location cannot be empty')
            .min(3, 'Event location must be at least 3 characters long')
            .max(255, 'Event location must not exceed 255 characters')
            .trim(),

        max_participants: z.coerce
            .number({
                required_error: 'Maximum participants is required',
                invalid_type_error: 'Maximum participants must be a number',
            })
            .int('Maximum participants must be a whole number')
            .min(1, 'Maximum participants must be at least 1')
            .max(10000, 'Maximum participants cannot exceed 10,000'),

        organizer_name: z
            .string({
                required_error: 'Organizer name is required',
                invalid_type_error: 'Organizer name must be a string',
            })
            .min(1, 'Organizer name cannot be empty')
            .min(2, 'Organizer name must be at least 2 characters long')
            .max(255, 'Organizer name must not exceed 255 characters')
            .trim(),

        category: z.enum(
            [
                'School',
                'Community',
                'Emergency',
                'Donation Drive',
                'Charity',
                'Relief Program',
                'Health',
                'Outreach',
                'Training',
                'Seminar',
                'Others',
            ],
            {
                required_error: 'Event category is required',
                invalid_type_error:
                    'Event category must be one of the predefined options',
            }
        ),

        department: z.string().optional(),

        specified_category: z.string().optional(),

        event_image: z
            .union([z.instanceof(File), z.string(), z.null()])
            .optional()
            .refine(
                (fileOrUrl) => {
                    // Only validate file properties if it's a File
                    if (fileOrUrl instanceof File) {
                        return fileOrUrl.size <= 5 * 1024 * 1024;
                    }
                    return true; // skip for URL or null
                },
                { message: 'Event image must be less than 5MB' }
            )
            .refine(
                (fileOrUrl) => {
                    if (fileOrUrl instanceof File) {
                        return [
                            'image/jpeg',
                            'image/png',
                            'image/gif',
                            'image/webp',
                        ].includes(fileOrUrl.type);
                    }
                    return true; // skip for URL or null
                },
                {
                    message:
                        'Event image must be in JPEG, PNG, GIF, or WEBP format',
                }
            ),

        // Beneficiary applicability fields - max_beneficiaries is optional when beneficiary_applicable is false
        beneficiary_applicable: z.boolean().optional().default(false),
        max_beneficiaries: z.any().optional(),
    })
    .refine(
        (data) => {
            if (!data.event_started || !data.event_ended) return true;
            return data.event_ended > data.event_started;
        },
        {
            message:
                'End date and time must be after the start date and time',
            path: ['event_ended'],
        }
    )
    .refine(
        (data) => {
            if (data.category !== 'School') return true;
            return data.department && data.department.trim().length > 0;
        },
        {
            message: 'Department is required when category is School',
            path: ['department'],
        }
    )
    .refine(
        (data) => {
            if (data.category !== 'Others') return true;
            return (
                data.specified_category &&
                data.specified_category.trim().length > 0
            );
        },
        {
            message:
                'Please specify a category name when "Others" is selected',
            path: ['specified_category'],
        }
    )
    .refine(
        (data) => {
            if (data.category === 'Others' && data.specified_category) {
                return (
                    data.specified_category.trim().length >= 2 &&
                    data.specified_category.trim().length <= 100
                );
            }
            return true;
        },
        {
            message:
                'Specified category must be between 2 and 100 characters',
            path: ['specified_category'],
        }
    )
    // Validate that max_beneficiaries is required only when beneficiary_applicable is true
    .refine(
        (data) => {
            if (!data.beneficiary_applicable) {
                return true; // No validation needed when beneficiary is not applicable
            }
            // When beneficiary is applicable, max_beneficiaries must be a valid number > 0
            return (
                data.max_beneficiaries &&
                typeof data.max_beneficiaries === 'number' &&
                !isNaN(data.max_beneficiaries) &&
                data.max_beneficiaries > 0
            );
        },
        {
            message:
                'Maximum beneficiaries is required and must be at least 1 when beneficiary applicable is checked',
            path: ['max_beneficiaries'],
        }
    )
    .refine(
        (data) => {
            if (
                !data.beneficiary_applicable ||
                !data.max_beneficiaries ||
                typeof data.max_beneficiaries !== 'number'
            ) {
                return true;
            }
            return (
                Number.isInteger(data.max_beneficiaries) &&
                data.max_beneficiaries <= 10000
            );
        },
        {
            message:
                'Maximum beneficiaries must be a whole number and cannot exceed 10,000',
            path: ['max_beneficiaries'],
        }
    );
