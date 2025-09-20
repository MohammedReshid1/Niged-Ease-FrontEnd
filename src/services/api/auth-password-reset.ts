import { userManagementApiClient } from './client';

// Request password reset
export const requestPasswordReset = async ({ email }: { email: string }): Promise<{ message: string }> => {
  try {
    const response = await userManagementApiClient.post<{ message: string }>('/auth/password-reset/', {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

// Confirm password reset with OTP and new password
export const passwordResetConfirm = async ({ 
  email, 
  otp, 
  new_password, 
  confirm_password 
}: { 
  email: string; 
  otp: string; 
  new_password: string; 
  confirm_password: string 
}): Promise<{ message: string }> => {
  try {
    const response = await userManagementApiClient.post<{ message: string }>('/auth/password-reset/confirm/', {
      email,
      otp,
      new_password,
      confirm_password
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
}; 