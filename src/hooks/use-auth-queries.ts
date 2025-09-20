import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, ApiError, RegisterRequest, CreateUserData, UserResponse } from '@/services/api/auth';

// Hook for logging in with email and password
export const useLogin = () => {
  return useMutation<
    { message: string },
    ApiError,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => authApi.login(email, password),
  });
};

// Hook for verifying OTP
export const useVerifyOtp = () => {
  return useMutation<
    { access: string; refresh: string; role: string; assigned_store?: any },
    ApiError,
    { email: string; otp: string }
  >({
    mutationFn: ({ email, otp }) => authApi.verifyOtp(email, otp),
  });
};

// Hook for resending OTP
export const useResendOtp = () => {
  return useMutation<
    { message: string },
    ApiError,
    { email: string }
  >({
    mutationFn: ({ email }) => authApi.resendOtp(email),
  });
};

// Hook for refreshing token
export const useRefreshToken = () => {
  return useMutation<
    { access: string; refresh: string },
    ApiError,
    { refreshToken: string }
  >({
    mutationFn: ({ refreshToken }) => authApi.refreshToken(refreshToken),
  });
};

// Hook for verifying token
export const useVerifyToken = (token: string | null) => {
  return useQuery({
    queryKey: ['verifyToken', token],
    queryFn: () => (token ? authApi.verifyToken(token) : Promise.reject('No token provided')),
    enabled: !!token,
    retry: false,
  });
};

// Hook for registering a new user
export const useRegister = () => {
  return useMutation<
    { message: string },
    ApiError,
    RegisterRequest
  >({
    mutationFn: (data) => authApi.register(data),
  });
};

// Hook for creating a user for a company
export const useCreateUser = () => {
  return useMutation<
    UserResponse,
    ApiError,
    CreateUserData
  >({
    mutationFn: (userData) => authApi.createUser(userData),
  });
}; 