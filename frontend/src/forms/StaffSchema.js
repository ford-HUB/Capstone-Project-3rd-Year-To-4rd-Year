import z from 'zod'

export const requestApprovalSchema = z.object({
    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
    .min(1, 'email is required')
})

export const staffRegistrationSchema = z.object({

    staff_id_number: z.string()
    .min(1, "Staff ID is required")
    .regex(/^[0-9]+$/, "Staff ID must contain only numbers"),

    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i }).min(1, "Email is required"),

    firstname: z.string()
        .min(1, "First name is required")
        .max(50, "First name too long"),

    lastname: z.string()
        .min(1, "Last name is required")
        .max(50, "Last name too long"),

    middle_initial: z.string()
        .min(1, "Middle name is required")
        .max(1, "Middle name must be exactly 1 character"),

    position: z.string()
        .min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),

    gender: z.enum(["M", "F"], {
        errorMap: () => ({ message: "Select a gender" }) }),

    phoneNumber: z.string()
        .regex(/^[0-9]+$/, "Contact number must contain only numbers")
        .min(11, "Contact number must be at least 11 digits")
        .max(15, "Contact number too long"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm Password is required")
    }).refine(data => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"]
});

export const staffLoginSchema = z.object({
    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
    .min(1, 'Email is required'),
    password: z.string().min(1, 'password is required'),
    rememberMe: z.boolean().optional()
})
