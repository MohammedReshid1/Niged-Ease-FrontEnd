import { userManagementApiClient, coreApiClient } from './client';
import tokenStorage from '@/utils/token-storage';
import { decodeToken } from '@/utils/token-helpers';

export interface AuthResponse {
  access: string;
  refresh: string;
  role: string;
  company_id: string;
  stores: {
    id: string;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: string;
  }[];
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface VerifyResetTokenData {
  token: string;
}

export interface SetNewPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: string;
}

export type ApiError = {
  error: string;
  statusCode?: number;
};

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface CreateUserData {
  company_id: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: string;
  profile_image?: string;
  assigned_store?: string;
}

export interface UserResponse {
  id: string;
  company_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

// Auth API
export const authApi = {
  // Login with email and password
  login: async (email: string, password: string): Promise<{ message: string }> => {
    const response = await userManagementApiClient.post<{ message: string }>('/auth/login/', {
      email,
      password
    });
    return response.data;
  },
  
  // Verify OTP after login
  verifyOtp: async (email: string, otp: string): Promise<{ 
    access: string; 
    refresh: string; 
    role: string; 
    company_id: string;
    stores: any[];
    assigned_store?: any;
  }> => {
    try {
      const response = await userManagementApiClient.post<{ 
        access: string; 
        refresh: string; 
        role: string; 
        company_id: string;
        stores: any[];
        assigned_store?: any;
      }>('/auth/verify-otp/', {
        email,
        otp
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },
  
  // Resend OTP
  resendOtp: async (email: string): Promise<{ message: string }> => {
    const response = await userManagementApiClient.post<{ message: string }>('/auth/resend-otp/', {
      email
    });
    return response.data;
  },
  
  // Verify token
  verifyToken: async (token: string): Promise<{
    is_valid: boolean;
    user_id?: string;
    email?: string;
    company_id?: string;
  }> => {
    try {
      const response = await userManagementApiClient.post<{
        is_valid: boolean;
        user_id?: string;
        email?: string;
        company_id?: string;
      }>('/auth/verify-token/', {
        token
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await userManagementApiClient.post<{ message: string }>('/auth/register/', data);
    return response.data;
  },
  
  // Create a user for a company
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    const response = await userManagementApiClient.post<UserResponse>('/users/', userData);
    return response.data;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        await userManagementApiClient.post('/auth/logout/', {
          refresh: refreshToken
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear tokens regardless of API call success
    tokenStorage.clearTokens();
  },
  
  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ access: string; refresh: string }> => {
    try {
      const response = await userManagementApiClient.post<{ access: string; refresh: string }>('/auth/refresh-token/', {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error: any) {
      // Enhance error with more context to improve debugging and error handling
      if (error.response && 
          (error.response.status === 401 || error.response.status === 400) &&
          (error.response.data?.detail === "Invalid or expired token" || 
           error.response.data?.error === "Invalid token" ||
           error.response.data?.error?.includes("expired"))) {
        console.error('Refresh token is invalid or expired');
        // Create a more specific error to help with error handling
        const enhancedError = new Error('Refresh token expired');
        enhancedError.name = 'ExpiredRefreshTokenError';
        // Pass along the original response
        (enhancedError as any).response = error.response;
        throw enhancedError;
      }
      
      // For other errors, just rethrow
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await userManagementApiClient.post<{ success: boolean; message: string }>('/auth/request-reset-password/', data);
    return response.data;
  },
  
  // Verify reset token
  verifyResetToken: async (data: VerifyResetTokenData): Promise<{ success: boolean; message: string }> => {
    const response = await userManagementApiClient.post<{ success: boolean; message: string }>('/auth/verify-reset-token/', data);
    return response.data;
  },
  
  // Set new password
  setNewPassword: async (data: SetNewPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await userManagementApiClient.post<{ success: boolean; message: string }>('/auth/set-new-password/', data);
    return response.data;
  },
  
  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    // Get the user ID from token
    const userInfo = tokenStorage.getUserInfo();
    if (!userInfo || !userInfo.id) {
      throw new Error('No user ID available in token');
    }
    
    try {
      // First get the current user data so we have all required fields
      const currentUserData = await authApi.getProfile();
      
      // Update the user with the new password
      const response = await userManagementApiClient.put<UserResponse>(
        `/users/${userInfo.id}/`,
        {
          company_id: currentUserData.company_id,
          email: currentUserData.email,
          password: data.new_password,
          first_name: currentUserData.first_name || '',
          last_name: currentUserData.last_name || '',
          role: currentUserData.role,
          profile_image: currentUserData.profile_image || ''
        }
      );
      
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
  
  // Get current user profile
  getProfile: async (): Promise<any> => {
    // First get the user's info from the token
    const userInfoFromToken = tokenStorage.getUserInfo();
    if (!userInfoFromToken || !userInfoFromToken.id) {
      throw new Error('No user ID available in token');
    }
    
    // Then fetch the full user details using the correct endpoint
    const response = await userManagementApiClient.get(`/users/${userInfoFromToken.id}/`);
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<AuthResponse['user']> => {
    // Get the user ID from token
    const userInfo = tokenStorage.getUserInfo();
    if (!userInfo || !userInfo.id) {
      throw new Error('No user ID available in token');
    }
    
    try {
      // First get the current user data so we have all required fields
      const currentUserData = await authApi.getProfile();
      
      // Now update the user profile with all required fields plus the new data
      const response = await userManagementApiClient.put<UserResponse>(
        `/users/${userInfo.id}/`,
        {
          company_id: currentUserData.company_id,
          email: data.email || currentUserData.email,
          first_name: data.first_name || currentUserData.first_name || '',
          last_name: data.last_name || currentUserData.last_name || '',
          role: currentUserData.role,
          profile_image: data.profile_image || currentUserData.profile_image || ''
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // Upload and update profile image
  updateProfileImage: async (imageUrl: string): Promise<AuthResponse['user']> => {
    // First get the user ID
    const userInfo = tokenStorage.getUserInfo();
    if (!userInfo || !userInfo.id) {
      throw new Error('No user ID available in token');
    }
    
    try {
      // First get the current user data so we have all required fields
      const currentUserData = await authApi.getProfile();
      
      // Only validate URL if it's not empty (empty means remove the image)
      if (imageUrl) {
        // Validate URL format and length
        if (imageUrl.length > 255) {
          throw new Error('Image URL must be less than 255 characters');
        }
        
        try {
          new URL(imageUrl); // This will throw if the URL is invalid
        } catch (e) {
          throw new Error('Please enter a valid URL');
        }
      }
      
      console.log('Updating profile image with:', imageUrl === '' ? '[EMPTY STRING]' : imageUrl);
      
      // Now update the user profile with all required fields plus the new image URL (or empty string to remove)
      const response = await userManagementApiClient.put<UserResponse>(
        `/users/${userInfo.id}/`,
        {
          company_id: currentUserData.company_id,
          email: currentUserData.email,
          first_name: currentUserData.first_name || '',
          last_name: currentUserData.last_name || '',
          role: currentUserData.role,
          profile_image: imageUrl // Empty string will remove the image
        }
      );
      
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  },
  
  // Check if authenticated (verifies token)
  checkAuth: async (): Promise<boolean> => {
    try {
      await userManagementApiClient.get('/auth/check/');
      return true;
    } catch (error) {
      return false;
    }
  }
}; 