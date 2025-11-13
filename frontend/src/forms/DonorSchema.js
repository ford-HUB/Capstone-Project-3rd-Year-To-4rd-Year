import z from 'zod'

export const signupSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
    .min(1, 'email is required'),

    password: z.string().min(8, "Password must be at least 8 characters"),
      
    confirmPassword: z.string().min(1, "Confirm Password is required"),

    termsAndCondtion: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", 
    path: ["confirmPassword"]
})

export const loginSchema = z.object({
  email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i}).min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
  rememberMe: z.boolean().optional()
})