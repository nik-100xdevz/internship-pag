import axios, { AxiosResponse } from 'axios';
import { Internship, ApplicationData, ApiResponse } from '../types';
import { MOCK_INTERNSHIPS } from '../utils/constants';
import { STORAGE_KEYS } from '../utils/constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // In production, this would be your API base URL
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Internship related methods
  async getInternshipsByRole(roleId: string): Promise<Internship[]> {
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filtered = MOCK_INTERNSHIPS.filter(internship => 
        internship.roleId === roleId
      );
      
      // Add some mock data for demonstration
      const additionalMockData = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, index) => ({
        ...MOCK_INTERNSHIPS[0],
        id: `${roleId}-${index + 10}`,
        title: `${MOCK_INTERNSHIPS[0].title} ${index + 2}`,
        company: `${MOCK_INTERNSHIPS[0].company} ${index + 2}`,
        stipend: `$${1200 + (index * 200)}/month`,
        applicationCount: Math.floor(Math.random() * 100) + 10,
      }));
      
      return [...filtered, ...additionalMockData];
    } catch (error) {
      throw new Error('Failed to fetch internships');
    }
  }

  async getInternshipById(id: string): Promise<Internship | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const internship = MOCK_INTERNSHIPS.find(i => i.id === id);
      if (!internship && id.includes('-')) {
        // Return a mock internship for dynamically generated IDs
        return {
          ...MOCK_INTERNSHIPS[0],
          id,
          title: 'Sample Internship Position',
          company: 'Tech Company Inc.',
        };
      }
      
      return internship || null;
    } catch (error) {
      throw new Error('Failed to fetch internship details');
    }
  }

  async submitApplication(applicationData: ApplicationData): Promise<ApiResponse<{ applicationId: string }>> {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate form validation and submission
      const applicationId = `app-${Date.now()}`;
      
      return {
        success: true,
        data: { applicationId },
        message: 'Application submitted successfully!',
      };
    } catch (error) {
      throw new Error('Failed to submit application');
    }
  }

  async uploadFile(file: File, type: 'resume' | 'portfolio'): Promise<string> {
    try {
      // Mock file upload - In production, this would upload to cloud storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a mock URL
      return `https://mock-storage.com/${type}/${Date.now()}-${file.name}`;
    } catch (error) {
      throw new Error(`Failed to upload ${type}`);
    }
  }

  async searchInternships(query: string, filters?: {
    location?: string;
    locationType?: string;
    stipendRange?: string;
  }): Promise<Internship[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let results = [...MOCK_INTERNSHIPS];
      
      // Apply search query
      if (query) {
        results = results.filter(internship =>
          internship.title.toLowerCase().includes(query.toLowerCase()) ||
          internship.company.toLowerCase().includes(query.toLowerCase()) ||
          internship.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      // Apply filters
      if (filters?.locationType) {
        results = results.filter(internship => internship.locationType === filters.locationType);
      }
      
      return results;
    } catch (error) {
      throw new Error('Failed to search internships');
    }
  }
}

export const apiService = new ApiService();