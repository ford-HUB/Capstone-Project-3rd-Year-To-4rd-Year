import z from 'zod'

export const directorLoginSchema = z.object({
    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
    .min(1, 'Email is required'),
    password: z.string().min(1, 'password is required'),
    rememberMe: z.boolean().optional()
})