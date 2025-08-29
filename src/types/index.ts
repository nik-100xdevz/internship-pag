export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface InternshipRole {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: 'Remote' | 'On-site' | 'Hybrid';
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  roleId: string;
  posted: string;
  deadline: string;
  applicationCount: number;
}

export interface ApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Education
  education: {
    degree: string;
    field: string;
    university: string;
    graduationYear: string;
    gpa?: string;
  };
  
  // Experience
  experience: {
    hasExperience: boolean;
    previousInternships?: string;
    projects?: string;
    skills: string;
  };
  
  // Application Specific
  coverLetter: string;
  whyInterested: string;
  availability: string;
  
  // Files
  resume?: File;
  portfolio?: File;
  
  // Agreements
  termsAccepted: boolean;
  internshipId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}