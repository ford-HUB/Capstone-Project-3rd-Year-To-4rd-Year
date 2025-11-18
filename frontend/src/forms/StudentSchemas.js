import { z } from 'zod';

export const signupSchema = z
    .object({
        studentId: z
            .string()
            .optional(),

        email: z
            .string()
            .email({
                pattern:
                    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
            })
            .min(1, 'Email is required'),

        password: z.string().min(8, 'Password must be at least 8 characters'),

        confirmPassword: z.string().min(1, 'Confirm Password is required'),

        firstName: z.string().min(1, 'First Name is required'),

        lastName: z.string().min(1, 'Last Name is required'),

        middleName: z
            .string()
            .min(1, 'Middle name is required')
            .max(1, 'Middle name must be exactly 1 character'),

        age: z
            .union([z.string(), z.number()])
            .transform((val) => {
                if (typeof val === 'string') {
                    const num = Number(val);
                    if (isNaN(num)) throw new Error('Age must be a valid number');
                    return num;
                }
                return val;
            })
            .refine((val) => val > 0, 'Age must be positive')
            .refine((val) => Number.isInteger(val), 'Age must be an integer')
            .refine((val) => val >= 1, 'Age must be at least 1')
            .refine((val) => val <= 120, 'Age must be reasonable')
            .optional(),

        gender: z.enum(['M', 'F'], {
            errorMap: () => ({ message: 'Select a gender' }),
        }),

        department: z.string().optional(),

        course: z.string().optional(),

        yearLevel: z
            .union([z.string(), z.number()])
            .transform((val) => {
                if (typeof val === 'string') {
                    const num = Number(val);
                    if (isNaN(num)) throw new Error('Year Level must be a valid number');
                    return num;
                }
                return val;
            })
            .optional(),

        phoneNumber: z
            .string()
            .min(1, 'Phone Number is required')
            .regex(/^[0-9]+$/, 'Must contain only numbers')
            .min(11, 'Phone number must be at least 11 digits')
            .max(13, 'Phone number must be at most 13 digits'),

        currentAddress: z.string().min(1, 'Current Address is required'),

        isBeneficiary: z
            .union([z.string(), z.boolean()])
            .transform((val) => {
                if (typeof val === 'string') {
                    return val === 'true';
                }
                return val;
            })
            .optional()
            .default(false),

        beneficiaryType: z.enum(['individual', 'organization']).optional(),

        organization_name: z.string().optional(),

        studentIdFile: z
            .any()
            .refine(
                (file) => file instanceof File || file?.[0] instanceof File,
                'Student ID is required'
            )
            .refine((file) => {
                const actualFile = file instanceof File ? file : file?.[0];
                return actualFile?.size <= 5000000;
            }, 'Max file size is 5MB')
            .refine((file) => {
                const actualFile = file instanceof File ? file : file?.[0];
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(
                    actualFile?.type
                );
            }, 'Only .jpg, .jpeg, .png formats are supported'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })
    .refine((data) => {
        // If not a beneficiary, student ID is required
        if (!data.isBeneficiary) {
            return data.studentId && data.studentId.trim().length > 0 && /^\d+$/.test(data.studentId);
        }
        return true;
    }, {
        message: "Student ID is required for regular volunteers",
        path: ['studentId'],
    })
    .refine((data) => {
        // If not a beneficiary, academic fields are required
        if (!data.isBeneficiary) {
            return data.department && data.department.trim().length > 0;
        }
        return true;
    }, {
        message: "Department is required for regular volunteers",
        path: ['department'],
    })
    .refine((data) => {
        // If not a beneficiary, course is required
        if (!data.isBeneficiary) {
            return data.course && data.course.trim().length > 0;
        }
        return true;
    }, {
        message: "Course is required for regular volunteers",
        path: ['course'],
    })
    .refine((data) => {
        // If not a beneficiary, year level is required
        if (!data.isBeneficiary) {
            return data.yearLevel && data.yearLevel >= 1 && data.yearLevel <= 4;
        }
        return true;
    }, {
        message: "Year level is required for regular volunteers",
        path: ['yearLevel'],
    })
    .refine((data) => {
        // If beneficiary and organization type, organization name is required
        if (data.isBeneficiary && data.beneficiaryType === 'organization') {
            return data.organization_name && data.organization_name.trim().length > 0;
        }
        return true;
    }, {
        message: "Organization name is required for organization beneficiaries",
        path: ['organization_name'],
    });

export const loginSchema = z.object({
    email: z
        .string()
        .email({
            pattern:
                /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        })
        .min(1, 'email is required'),
    password: z.string().min(1, 'password is required'),
});

export const updateProfileSchema = z.object({
    firstname: z.string().min(1, 'Firstname is required'),

    lastname: z.string().min(1, 'Lastname is required'),

    gender: z.enum(['M', 'F', '']).optional(),

    middle_initial: z
        .string()
        .min(1, 'Middle initial is required')
        .max(1, 'Middle initial must be exactly 1 character'),

    phone_number: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits'),

    current_address: z.string().min(1, 'Current address is required'),

    course: z.string().min(1, 'Course is required').optional().nullable(),

    department: z.string().min(1, 'Department is required'),

    year_level: z
        .number({ invalid_type_error: 'Year level must be a number' })
        .int('Year level must be an integer')
        .min(1, 'Year level must be at least 1')
        .max(12, 'Year level cannot be greater than 6')
        .optional(),

    disability: z.string().optional().or(z.literal('')), // allows empty string

    disability_specification: z.string().optional(),

    is_subscribed: z.boolean({
        required_error: 'Subscribed status is required',
        invalid_type_error: 'Subscribed status must be true or false',
    }),
});

export const emailUpdateSchema = z
    .object({
        newEmail: z
            .string()
            .email({ message: 'Please provide a valid email address' })
            .min(1, { message: 'New email is required' }),

        confirmEmail: z
            .string()
            .min(1, { message: 'Please confirm your email' }),
    })
    .refine((data) => data.newEmail === data.confirmEmail, {
        path: ['confirmEmail'],
        message: 'Confirm email must match new email',
    });



export const emergencyContactSchema = z.object({
    emergency_contact_fullname: z
        .string()
        .trim()
        .optional()
        .or(z.literal('')),

    emergency_contact_number: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine((val) => {
            if (!val || val === '') return true;
            return /^\d{11}$/.test(val);
        }, 'Emergency contact number must be exactly 11 digits'),

    relationship: z
        .string()
        .trim()
        .optional()
        .or(z.literal('')),

    emergency_contact_email: z
        .string()
        .trim()
        .optional()
        .or(z.literal(''))
        .refine((val) => {
            if (!val || val === '') return true;
            return z.string().email().safeParse(val).success;
        }, 'Please provide a valid email address'),
});
