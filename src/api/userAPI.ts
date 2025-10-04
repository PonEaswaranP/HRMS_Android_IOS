import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { UserInfo } from '../types';

const TOKEN_KEY = '@hrms_access_token';

// Development mode - set to false when real API is available
const DEVELOPMENT_MODE = true;

// Mock data for development
const MOCK_EMPLOYEE_USER: UserInfo = {
  user_id: 1,
  email: 'employee@hrms.com',
  first_name: 'John',
  last_name: 'Employee',
  full_name: 'John Employee',
  access_level: {
    value: 'Employee',
    label: 'Employee'
  },
  role: {
    id: 2,
    name: 'Software Developer',
    description: 'Develops and maintains software applications'
  },
  organization: {
    id: 1,
    name: 'Tech Corp'
  },
  department: {
    id: 1,
    name: 'Engineering'
  },
  is_active: true,
  date_joined: '2023-01-15T10:00:00Z'
};

const MOCK_HR_USER: UserInfo = {
  user_id: 2,
  email: 'hr@hrms.com',
  first_name: 'Sarah',
  last_name: 'HR Manager',
  full_name: 'Sarah HR Manager',
  access_level: {
    value: 'HR',
    label: 'Human Resources'
  },
  role: {
    id: 1,
    name: 'HR Manager',
    description: 'Manages human resources and employee relations'
  },
  organization: {
    id: 1,
    name: 'Tech Corp'
  },
  department: {
    id: 2,
    name: 'Human Resources'
  },
  is_active: true,
  date_joined: '2022-06-01T09:00:00Z'
};

class UserAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from AsyncStorage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear storage
          await AsyncStorage.removeItem(TOKEN_KEY);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get current user information
   * @returns Promise with UserInfo data
   */
  async getCurrentUser(): Promise<UserInfo> {
    // Development mode - return mock data
    if (DEVELOPMENT_MODE) {
      try {
        // Simulate API delay
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
        
        // Check stored token to determine user type
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Return HR user 30% of the time, Employee 70% of the time
        if (Math.random() < 0.3) {
          return MOCK_HR_USER;
        } else {
          return MOCK_EMPLOYEE_USER;
        }
      } catch (error) {
        throw new Error('Authentication required. Please login again.');
      }
    }

    // Production mode - call real API
    try {
      const response = await this.api.get<UserInfo>('/users/me/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Failed to fetch user information';
        throw new Error(errorMessage);
      }
      throw new Error('An unexpected error occurred while fetching user information');
    }
  }

  /**
   * Update user profile
   * @param data Partial user data to update
   * @returns Promise with updated UserInfo
   */
  async updateUserProfile(data: Partial<UserInfo>): Promise<UserInfo> {
    try {
      const response = await this.api.patch<UserInfo>('/users/me/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Failed to update user profile';
        throw new Error(errorMessage);
      }
      throw new Error('An unexpected error occurred while updating profile');
    }
  }

  /**
   * Get user by ID (for HR/Admin)
   * @param userId User ID to fetch
   * @returns Promise with UserInfo data
   */
  async getUserById(userId: number): Promise<UserInfo> {
    try {
      const response = await this.api.get<UserInfo>(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Failed to fetch user data';
        throw new Error(errorMessage);
      }
      throw new Error('An unexpected error occurred while fetching user data');
    }
  }

  /**
   * Logout user by calling the API and clearing tokens
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      // Get the current access and refresh tokens before making the API call
      const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem('@hrms_refresh_token');

      if (!accessToken) {
        console.log('No access token found - clearing local storage only');
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem('@hrms_refresh_token');
        return;
      }

      console.log('Making logout API call with token:', accessToken.substring(0, 20) + '...');
      console.log('Full access token for debugging:', accessToken);
      console.log('Refresh token for debugging:', refreshToken);

      // Check if this is a development mode token
      const isDevelopmentToken = accessToken.startsWith('dev_token_') || accessToken === 'dev-token-12345';
      
      if (isDevelopmentToken) {
        console.log('Development mode token detected - skipping API call and clearing locally');
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem('@hrms_refresh_token');
        console.log('Development tokens cleared successfully');
        return;
      }

      // Only call API for real tokens
      console.log('Real token detected - calling logout API');

      // Create axios request for logout with correct URL, body, and auth header
      const logoutResponse = await axios.post(
        'http://192.168.1.54:8000/api/logout/',
        { refresh: refreshToken }, // Send refresh token in the body
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      
      console.log('Logout API call successful:', logoutResponse.status);
      
      // Clear stored tokens after successful API call
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('@hrms_refresh_token');
      console.log('Local tokens cleared successfully');
    } catch (error) {
      // Log the error for debugging
      console.error('Logout API call failed:', error);
      
      // Even if API call fails, clear tokens locally to ensure user is logged out
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('@hrms_refresh_token');
      console.log('Local tokens cleared after API failure');
      
      // Log detailed error information but don't prevent logout
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data;
        console.warn(`Logout API error: Status ${statusCode}`, errorData);
        
        if (statusCode === 401) {
          console.log('Token was already invalid - logout successful locally');
        } else if (statusCode === 405) {
          console.log('Method not allowed - check if endpoint accepts POST');
        }
      } else {
        console.error('Network or other error:', error);
      }
    }
  }
}

// Export singleton instance
export const userAPI = new UserAPI();
