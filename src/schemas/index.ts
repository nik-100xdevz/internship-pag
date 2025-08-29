import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  
  // Education
  education: z.object({
    degree: z.string().min(1, 'Degree is required'),
    field: z.string().min(1, 'Field of study is required'),
    university: z.string().min(1, 'University is required'),
    graduationYear: z.string().min(4, 'Graduation year is required'),
    gpa: z.string().optional(),
  }),
  
  // Experience
  experience: z.object({
    hasExperience: z.boolean(),
    previousInternships: z.string().optional(),
    projects: z.string().optional(),
    skills: z.string().min(10, 'Please describe your relevant skills'),
  }),
  
  // Application Specific
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters'),
  whyInterested: z.string().min(5, 'Please explain why you are interested (min 5 characters)'),
  availability: z.string().min(1, 'Availability is required'),
  
  // Agreements
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  
  internshipId: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;