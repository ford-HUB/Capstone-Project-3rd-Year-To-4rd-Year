import z from 'zod'

export const donorProfileUpdateSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
        .optional()
})

export const donorPasswordUpdateSchema = z.object({
    currentPassword: z.string()
        .min(1, "Current password is required"),

    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),

    confirmPassword: z.string()
        .min(1, "Please confirm your new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
})
