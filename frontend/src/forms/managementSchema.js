import z from "zod";

export const requestApprovalSchema = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email()
    .regex(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      "Invalid email format"
    ),

  fullname: z
    .string()
    .min(1, "Fullname is required")
    .max(100, "Fullname must be at most 100 characters"),

  requested_role: z.enum(["staff", "coordinator", "assistant_coordinator"], {
    required_error: "Requested role is required",
    invalid_type_error: "Invalid role",
  }),

  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(255, "Reason must be at most 255 characters"),
});

export const setUpRequestSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm Password is required"),

    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "coordinator" && !data.department) {
        return false;
      }
      return true;
    },
    {
      message: "Department is required for coordinators",
      path: ["department"],
    }
  );


export const profileInfoSchema = z.object({
  firstname: z.string()
    .min(1, "First name is required")
    .max(255, "First name must be at most 255 characters"),

  lastname: z.string()
    .min(1, "Last name is required")
    .max(255, "Last name must be at most 255 characters"),

  middle_initial: z.string()
    .min(1, "Middle initial is required")
    .max(5, "Middle initial must be at most 5 characters"),

  gender: z.enum(["M", "F"], {
    required_error: "Gender is required"
  }),

  email_address: z.string().email("Invalid email format").or(z.literal("")).optional(),

  phone_number: z.string()
    .regex(/^\d{10,11}$/, "Phone number must be 10 or 11 digits"),

  bio: z.string()
    .min(1, "Bio is required")
    .max(1000, "Bio must be at most 1000 characters"),

  department: z.string()
    .max(255, "Department must be at most 255 characters")
    .nullable()
    .optional()
});

export const AddressSchema = z.object({
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

export const managementLoginSchema = z.object({
  email: z
    .string()
    .email({
      pattern:
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
    })
    .min(1, "Email is required"),
  password: z.string().min(1, "password is required"),
  rememberMe: z.boolean().optional(),
});

export const updateEmailSchema = z.object({
  email: z
    .string()
    .email({
      pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i
    })
    .min(1, "Email is required"),
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only JPEG, PNG, GIF, and WEBP formats are allowed",
      }
    ),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Password requires at least 6 characters (digits or letters)",
  }),
});
