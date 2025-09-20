import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset, passwordResetConfirm } from '@/services/api/auth-password-reset';

// Hook for requesting password reset
export const useRequestPasswordReset = () => {
  return useMutation<
    { message: string },
    Error,
    { email: string }
  >({
    mutationFn: (data) => requestPasswordReset(data),
  });
};

// Hook for confirming password reset with OTP and new password
export const usePasswordResetConfirm = () => {
  return useMutation<
    { message: string },
    Error,
    { email: string; otp: string; new_password: string; confirm_password: string }
  >({
    mutationFn: (data) => passwordResetConfirm(data),
  });
}; 