import { z } from 'zod';

// Beneficiary Personal Information Schema for Event Registration
export const beneficiaryPersonalInfoSchema = z.object({
    firstname: z.string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    
    lastname: z.string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    
    middle_initial: z.string()
        .max(1, 'Middle initial must be exactly 1 character')
        .optional()
        .or(z.literal('')),
    
    phone_number: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(11, 'Phone number must be at most 11 digits'),
    
    current_address: z.string()
        .min(1, 'Current address is required')
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address must be less than 200 characters'),
    
    age: z.coerce
        .number()
        .int('Age must be an integer')
        .min(1, 'Age must be at least 1')
        .max(120, 'Age must be reasonable'),
    
    gender: z.enum(['M', 'F', 'O'], {
        required_error: 'Please select your gender'
    }),
    
    organization_name: z.string()
        .max(100, 'Organization name must be less than 100 characters')
        .optional()
        .or(z.literal(''))
});

// Beneficiary Contact Information Schema
export const beneficiaryContactSchema = z.object({
    contact_number: z.string()
        .min(1, 'Contact number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
    
    emergency_contact_name: z.string()
        .min(1, 'Emergency contact name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    
    emergency_contact_number: z.string()
        .min(1, 'Emergency contact number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
    
    relationship: z.string()
        .min(1, 'Relationship is required')
        .min(2, 'Relationship must be at least 2 characters')
        .max(30, 'Relationship must be less than 30 characters'),
    
    emergency_contact_email: z.string()
        .email('Please enter a valid email address')
        .optional()
        .or(z.literal('')),
    
    special_requirements: z.string()
        .max(500, 'Special requirements must be less than 500 characters')
        .optional(),
    
    transportation_needed: z.boolean().default(false)
});

// Combined Beneficiary Event Registration Schema
export const beneficiaryEventRegistrationSchema = z.object({
    // Needs Assessment Information
    current_situation: z.string()
        .min(1, 'Please tell us about your current situation')
        .min(10, 'Please provide more details about your current situation (at least 10 characters)')
        .max(1000, 'Current situation description must be less than 1000 characters'),
    
    needs: z.string()
        .min(1, 'Please tell us what your needs are')
        .min(10, 'Please provide more details about your needs (at least 10 characters)')
        .max(1000, 'Needs description must be less than 1000 characters'),
    
    how_can_we_help: z.string()
        .min(1, 'Please tell us how we can help you')
        .min(10, 'Please provide more details about how we can assist you (at least 10 characters)')
        .max(1000, 'How we can help description must be less than 1000 characters'),
    
    // ID Verification Information
    id_files: z.any()
        .refine((files) => {
            if (!files) return false;
            if (files.length === 0) return false;
            
            // Handle both FileList and array
            const fileArray = Array.from(files);
            return fileArray.length > 0;
        }, 'Please upload at least one photo of your ID')
        .refine((files) => {
            if (!files) return false;
            const fileArray = Array.from(files);
            return fileArray.every(file => file.size <= 5000000);
        }, 'Each file must be less than 5MB')
        .refine((files) => {
            if (!files) return false;
            const fileArray = Array.from(files);
            return fileArray.every(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type));
        }, 'Only JPEG, PNG, and WebP images are allowed')
});

// Beneficiary Registration Schema
export const beneficiaryRegistrationSchema = z.object({
    firstname: z.string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    
    lastname: z.string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    
    middlename: z.string()
        .max(50, 'Middle name must be less than 50 characters')
        .optional(),
    
    phoneNumber: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
    
    address: z.string()
        .min(1, 'Address is required')
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address must be less than 200 characters'),
    
    age: z.number()
        .min(18, 'You must be at least 18 years old')
        .max(120, 'Please enter a valid age'),
    
    gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Please select your gender'
    }),
    
    beneficiaryType: z.enum(['individual', 'organization'], {
        required_error: 'Please select beneficiary type'
    }),
    
    organization_name: z.string()
        .max(100, 'Organization name must be less than 100 characters')
        .optional()
}).refine((data) => {
    // If beneficiary type is organization, organization_name is required
    if (data.beneficiaryType === 'organization' && !data.organization_name) {
        return false;
    }
    return true;
}, {
    message: 'Organization name is required when beneficiary type is organization',
    path: ['organization_name']
});

// Beneficiary Profile Update Schema
export const beneficiaryProfileUpdateSchema = z.object({
    firstname: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .optional(),
    
    lastname: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .optional(),
    
    middle_initial: z.string()
        .max(1, 'Middle initial must be exactly 1 character')
        .optional()
        .or(z.literal('')),
    
    phone_number: z.string()
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(11, 'Phone number must be at most 11 digits')
        .optional(),
    
    current_address: z.string()
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address must be less than 200 characters')
        .optional(),
    
    age: z.coerce
        .number()
        .int('Age must be an integer')
        .min(1, 'Age must be at least 1')
        .max(120, 'Age must be reasonable')
        .optional(),
    
    gender: z.enum(['M', 'F', 'O'])
        .optional(),
    
    organization_name: z.string()
        .max(100, 'Organization name must be less than 100 characters')
        .optional()
        .or(z.literal(''))
});

// Update Beneficiary Profile Schema (for form updates)
export const updateBeneficiaryProfileSchema = z.object({
    firstname: z.string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    
    lastname: z.string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    
    middle_initial: z.string()
        .max(1, 'Middle initial must be exactly 1 character')
        .optional()
        .or(z.literal('')),
    
    phone_number: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(11, 'Phone number must be at most 11 digits'),
    
    current_address: z.string()
        .min(1, 'Current address is required')
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address must be less than 200 characters'),
    
    age: z.coerce
        .number()
        .int('Age must be an integer')
        .min(1, 'Age must be at least 1')
        .max(120, 'Age must be reasonable'),
    
    gender: z.enum(['M', 'F', 'O'], {
        required_error: 'Please select your gender'
    }),
    
    organization_name: z.string()
        .max(100, 'Organization name must be less than 100 characters')
        .optional()
        .or(z.literal(''))
});

// Beneficiary Email Update Schema
export const beneficiaryEmailUpdateSchema = z.object({
    newEmail: z.string()
        .email('Please enter a valid email address')
        .min(1, 'New email is required'),
    
    confirmEmail: z.string()
        .email('Please enter a valid email address')
        .min(1, 'Email confirmation is required')
}).refine((data) => data.newEmail === data.confirmEmail, {
    message: 'Email confirmation does not match',
    path: ['confirmEmail']
});

// Beneficiary Password Change Schema
export const beneficiaryPasswordChangeSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required'),
    
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    confirmPassword: z.string()
        .min(1, 'Password confirmation is required')
}).superRefine((data, ctx) => {
    // Only validate password match if both fields have values
    if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password confirmation does not match',
            path: ['confirmPassword']
        });
    }
    
    // Only validate if new password is different from current
    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'New password must be different from current password',
            path: ['newPassword']
        });
    }
});

export default {
    beneficiaryPersonalInfoSchema,
    beneficiaryContactSchema,
    beneficiaryEventRegistrationSchema,
    beneficiaryRegistrationSchema,
    beneficiaryProfileUpdateSchema,
    updateBeneficiaryProfileSchema,
    beneficiaryEmailUpdateSchema,
    beneficiaryPasswordChangeSchema
};
