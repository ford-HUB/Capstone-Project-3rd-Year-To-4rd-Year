import { z } from 'zod';

export const volunteerRegistrationSchema = z
    .object({
        studentId: z.string().optional(),

        email: z
            .string()
            .email({
                pattern:
                    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
            })
            .min(1, 'Email is required'),

        password: z.string().min(6, 'Password must be at least 6 characters'),

        confirmPassword: z.string().min(1, 'Confirm Password is required'),

        firstName: z.string().min(1, 'First Name is required'),

        lastName: z.string().min(1, 'Last Name is required'),

        middleName: z
            .string()
            .min(1, 'Middle name is required')
            .max(1, 'Middle name must be exactly 1 character'),

        age: z.coerce
            .number()
            .int('Age must be an integer')
            .min(15, 'Age must be at least 15')
            .max(100, 'Age must be at most 100'),

        yearLevel: z.union([z.string(), z.number(), z.undefined()]),

        gender: z.enum(['M', 'F'], {
            errorMap: () => ({ message: 'Select a gender' }),
        }),

        department: z.string(),

        course: z.string(),

        phoneNumber: z
            .string()
            .min(1, 'Phone Number is required')
            .regex(/^[0-9]{11}$/, 'Phone number must be exactly 11 digits'),

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

        beneficiaryType: z
            .string()
            .optional()
            .transform((val) => {
                // Convert empty string to undefined for regular volunteers
                if (val === '' || val === null) {
                    return undefined;
                }
                return val;
            })
            .refine((val) => {
                // If value exists, it must be one of the valid options
                if (val === undefined) return true;
                return ['individual', 'organization'].includes(val);
            }, {
                message: 'Invalid option: expected one of "individual"|"organization"'
            }),

        participantType: z
            .string()
            .optional()
            .transform((val) => {
                // Convert empty string to undefined
                if (val === '' || val === null) {
                    return undefined;
                }
                return val;
            })
            .refine((val) => {
                // If value exists, it must be one of the valid options
                if (val === undefined) return true;
                return ['student', 'staff', 'faculty', 'alumni'].includes(val);
            }, {
                message: 'Invalid option: expected one of "student"|"staff"|"faculty"|"alumni"'
            }),

        organization_name: z.string().optional(),

        studentIdFile: z.any().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), student ID is required
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                return (
                    data.studentId &&
                    data.studentId.trim().length === 8 &&
                    /^\d{8}$/.test(data.studentId)
                );
            }
            // For beneficiaries, studentId is optional
            return true;
        },
        {
            message: 'Student ID is required for regular volunteers',
            path: ['studentId'],
        }
    )
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), student ID file is required
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                return (
                    data.studentIdFile instanceof File ||
                    data.studentIdFile?.[0] instanceof File
                );
            }
            return true;
        },
        {
            message: 'Student ID file is required for regular volunteers',
            path: ['studentIdFile'],
        }
    )
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), department is required
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                return data.department && data.department.trim().length > 0;
            }
            // For beneficiaries, department is optional
            return true;
        },
        {
            message: 'Department is required for regular volunteers',
            path: ['department'],
        }
    )
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), course is required
            // But course is optional for staff and faculty
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                const isStaffOrFaculty = data.participantType === 'staff' || data.participantType === 'faculty';
                if (isStaffOrFaculty) {
                    return true; // Course is optional for staff/faculty
                }
                return data.course && data.course.trim().length > 0;
            }
            // For beneficiaries, course is optional
            return true;
        },
        {
            message: 'Course is required for regular volunteers (except staff and faculty)',
            path: ['course'],
        }
    )
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), year level is required and must be valid
            // But year level is optional for staff and faculty
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                const isStaffOrFaculty = data.participantType === 'staff' || data.participantType === 'faculty';
                if (isStaffOrFaculty) {
                    return true; // Year level is optional for staff/faculty
                }
                if (!data.yearLevel) return false;
                const num = Number(data.yearLevel);
                return !isNaN(num) && num >= 1 && num <= 12;
            }
            return true;
        },
        {
            message: 'Year level is required for regular volunteers (except staff and faculty)',
            path: ['yearLevel'],
        }
    )
    .refine(
        (data) => {
            // If beneficiary (isBeneficiary is "true") and organization type, organization name is required
            if ((data.isBeneficiary === "true" || data.isBeneficiary === true) && data.beneficiaryType === 'organization') {
                return (
                    data.organization_name &&
                    data.organization_name.trim().length > 0
                );
            }
            return true;
        },
        {
            message:
                'Organization name is required for organization beneficiaries',
            path: ['organization_name'],
        }
    )
    .refine(
        (data) => {
            // If not a beneficiary (isBeneficiary is "false"), participant type is required
            if (data.isBeneficiary === "false" || data.isBeneficiary === false) {
                return (
                    data.participantType &&
                    ['student', 'staff', 'faculty', 'alumni'].includes(data.participantType)
                );
            }
            // For beneficiaries, participantType is optional
            return true;
        },
        {
            message: 'Participant type is required for regular volunteers',
            path: ['participantType'],
        }
    );
