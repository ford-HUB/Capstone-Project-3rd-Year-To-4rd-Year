import { z } from 'zod';

export const createSubmissionSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters')
        .trim(),
    description: z.string()
        .max(1000, 'Description must be less than 1000 characters')
        .optional()
        .or(z.literal('')),
    submission_type: z.enum(['Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance'], {
        required_error: 'Submission type is required',
        invalid_type_error: 'Please select a valid submission type'
    }),
    department_id: z.number()
        .int('Department ID must be an integer')
        .positive('Department ID must be positive'),
    file: z.instanceof(File, {
        message: 'File is required'
    }).refine(
        (file) => file && file.size > 0,
        'File is required'
    ).refine(
        (file) => file && file.size <= 10 * 1024 * 1024, // 10MB limit
        'File size must be less than 10MB'
    ).refine(
        (file) => {
            if (!file) return false;
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/png',
                'image/gif'
            ];
            return allowedTypes.includes(file.type);
        },
        'File type must be PDF, Word, Excel, or image (JPEG, PNG, GIF)'
    )
});

export const updateSubmissionSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters')
        .trim()
        .optional(),
    description: z.string()
        .max(1000, 'Description must be less than 1000 characters')
        .optional()
        .or(z.literal('')),
    submission_type: z.enum(['Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance'])
        .optional(),
    status: z.enum(['submitted', 'under_review', 'approved', 'rejected'])
        .optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
);

export const submissionFilterSchema = z.object({
    department_id: z.number()
        .int('Department ID must be an integer')
        .positive('Department ID must be positive')
        .optional(),
    submission_type: z.enum(['Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance'])
        .optional(),
    status: z.enum(['submitted', 'under_review', 'approved', 'rejected'])
        .optional(),
    submitted_by: z.number()
        .int('Submitted by ID must be an integer')
        .positive('Submitted by ID must be positive')
        .optional()
});
