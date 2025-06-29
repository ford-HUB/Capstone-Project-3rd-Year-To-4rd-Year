import { z } from "zod";

export const signupSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .regex(/^\d+$/, "Must contain only numbers"),
  
  email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i }).min(1, "Email is required"),
  
  password: z.string().min(8, "Password must be at least 8 characters"),
  
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  
  firstName: z.string().min(1, "First Name is required"),
  
  lastName: z.string().min(1, "Last Name is required"),
  
  middleName: z
  .string()
  .min(1, "Middle name is required")
  .max(1, "Middle name must be exactly 1 character"),
  
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .positive("Age must be positive")
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be reasonable")
    .optional(),
  
  gender: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Select a gender" })
    }),
  
  department: z.string().min(1, "Department is required"),
  
  course: z.string().min(1, "Course is required"),
  
  yearLevel: z
    .number({ invalid_type_error: "Year Level must be a number" })
    .min(1, "Minimum year level is 1")
    .max(4, "Maximum year level is 4"),
  
  phoneNumber: z
    .string()
    .min(1, "Phone Number is required")
    .regex(/^[0-9]+$/, "Must contain only numbers")
    .min(11, "Phone number must be at least 11 digits")
    .max(13, "Phone number must be at most 13 digits"),
  
  currentAddress: z.string().min(1, "Current Address is required"),
  
  studentIdFile: z
  .any()
  .refine(
    (file) => file instanceof File || file?.[0] instanceof File, 
    "Student ID is required"
  )
  .refine(
    (file) => {
      const actualFile = file instanceof File ? file : file?.[0];
      return actualFile?.size <= 5000000;
    }, 
    "Max file size is 5MB"
  )
  .refine(
    (file) => {
      const actualFile = file instanceof File ? file : file?.[0];
      return ["image/jpeg", "image/png", "image/jpg"].includes(actualFile?.type);
    },
    "Only .jpg, .jpeg, .png formats are supported"
  )
}).refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: "Passwords don't match", 
    path: ["confirmPassword"]
  }
)

export const loginSchema = z.object({
  email: z.string().email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i}).min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
  rememberMe: z.boolean().optional()
})