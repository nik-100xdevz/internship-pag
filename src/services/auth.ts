import { LoginCredentials, RegisterData, User, ApiResponse } from '../types';

// Mock authentication service - Replace with actual API calls
class AuthService {
  private baseUrl = '/api/auth'; // In production, this would be your API base URL

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - In production, this would be handled by your backend
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return { user: mockUser, token: mockToken };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user creation
    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    return { user: mockUser, token: mockToken };
  }

  async getCurrentUser(): Promise<User> {
    // Simulate API call to get current user
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    throw new Error('User not found');
  }

  async refreshToken(token: string): Promise<string> {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'refreshed-' + token;
  }
}

export const authService = new AuthService();