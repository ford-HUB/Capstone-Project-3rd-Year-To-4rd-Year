import z from 'zod'

export const directorLoginSchema = z.object({
    email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
    .min(1, 'Email is required'),
    password: z.string().min(1, 'password is required'),
    rememberMe: z.boolean().optional()
})

export const createDirectorInfoSchema = z.object({
    facebook: z.string()
    .url({ message: 'Facebook must be a valid URL' })
    .or(z.literal('').or(z.null()))
    .optional(),

    insta: z.string()
    .url({ message: 'Instagram must be a valid URL' })
    .or(z.literal('').or(z.null()))
    .optional(),

    linkedin: z.string()
    .url({ message: 'LinkedIn must be a valid URL' })
    .or(z.literal('').or(z.null()))
    .optional(),

    X: z.string()
    .url({ message: 'X (Twitter) must be a valid URL' })
    .or(z.literal('').or(z.null()))
    .optional(),

    firstname: z.string({
      required_error: 'Firstname is required',
      invalid_type_error: 'Firstname must be a string',
    }),

    lastname: z.string({
      required_error: 'Lastname is required',
      invalid_type_error: 'Lastname must be a string',
    }),

    email_address: z.string({
      required_error: 'Email address is required',
      invalid_type_error: 'Email address must be a string',
    })
    .email({ message: 'Email address must be a valid email' }),

    phone_number: z.string({
      required_error: 'Phone number is required',
    })
    .regex(/^\d{10,11}$/, {
      message: 'Phone number must be 10 or 11 digits',
    }),

    role_bio: z.string({
      required_error: 'Role is required',
      invalid_type_error: 'Role must be a string',
    }),

    school: z.string({
      required_error: 'School is required',
      invalid_type_error: 'School must be a string',
    })
})

export const createDirectorAddressSchema = z.object({
  province: z.string({
    required_error: 'Province is required',
    invalid_type_error: 'Province must be a string',
  }).min(1, { message: 'Province cannot be empty' }),

  city: z.string({
    required_error: 'City is required',
    invalid_type_error: 'City must be a string',
  }).min(1, { message: 'City cannot be empty' }),

  postal_code: z.string({
    required_error: 'Postal code is required',
  }).min(1, { message: 'Postal code cannot be empty' }),

  brgy: z.string({
    required_error: 'Barangay is required',
    invalid_type_error: 'Barangay must be a string',
  }).min(1, { message: 'Barangay cannot be empty' })
});

export const updateEmailSchema = z.object({
  email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i })
  .min(1, 'Email is required'),
  avatar: z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
    message: 'Image must be less than 5MB',
  })
  .refine(
    (file) =>
      !file || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    {
      message: 'Only JPEG, PNG, GIF, and WEBP formats are allowed',
    }
  )
})

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, { message: 'Password requires at least 6 characters (digits or letters)' })
})
