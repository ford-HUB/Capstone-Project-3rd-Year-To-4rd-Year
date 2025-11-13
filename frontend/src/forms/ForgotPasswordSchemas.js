import { z } from 'zod';

// Forgot Password Email Schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address')
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Email Check Schema (for real-time validation)
export const emailCheckSchema = z.object({
    email: z.string().email('Please enter a valid email address')
});
