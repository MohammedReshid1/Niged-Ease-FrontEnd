'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Key, NumberCircleOne, NumberCircleTwo, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useRequestPasswordReset, usePasswordResetConfirm } from '@/hooks/use-password-reset';

// Define the form schema
const schema = zod.object({
  otp: zod.string().min(1, 'OTP is required'),
  new_password: zod.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: zod.string().min(1, 'Confirm password is required'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type Values = zod.infer<typeof schema>;

interface ResetPasswordFormProps {
  email: string;
  onBack: () => void;
}

function ResetPasswordForm({ email, onBack }: ResetPasswordFormProps): React.JSX.Element {
  const { t, i18n } = useTranslation('auth');
  const router = useRouter();
  const passwordResetConfirmMutation = usePasswordResetConfirm();
  const requestPasswordResetMutation = useRequestPasswordReset();
  
  // Safe translation function to handle missing translations
  const safeTranslate = (key: string, fallback: string): string => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const defaultValues = { 
    otp: '', 
    new_password: '', 
    confirm_password: '' 
  } satisfies Values;

  const [resetSuccess, setResetSuccess] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        await passwordResetConfirmMutation.mutateAsync({
          email,
          otp: values.otp,
          new_password: values.new_password,
          confirm_password: values.confirm_password
        });
        
        // Show success message
        setResetSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(paths.auth.signIn);
        }, 3000);
      } catch (error: any) {
        const errorMessage = error?.error || safeTranslate('invalid_otp', 'Invalid OTP');
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [email, router, setError, safeTranslate, passwordResetConfirmMutation]
  );

  const handleResendOtp = async () => {
    try {
      await requestPasswordResetMutation.mutateAsync({ email });
      // Show success message
      setError('root', { 
        type: 'server', 
        message: safeTranslate('otp_resent', 'OTP has been resent to your email') 
      });
    } catch (error: any) {
      const errorMessage = error?.error || safeTranslate('error_resending_otp', 'Error resending OTP');
      setError('root', { type: 'server', message: errorMessage });
    }
  };

  // If password reset is successful, show success message
  if (resetSuccess) {
    return (
      <Stack 
        spacing={4}
        sx={{ 
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          },
          width: '100%',
          maxWidth: { xs: '100%', sm: '450px' },
          mx: 'auto',
          px: { xs: 2, sm: 0 }
        }}
      >
        <Stack spacing={1} alignItems="center">
          <Box 
            component="img"
            src="/assets/Neged.png"
            alt="NIGED-EASE Logo"
            sx={{
              mb: { xs: 1, sm: 2 },
              width: { xs: 70, sm: 80 },
              height: { xs: 70, sm: 80 },
              borderRadius: '20%',
              objectFit: 'cover',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              border: '4px solid rgba(255, 255, 255, 0.8)',
              padding: 0.5
            }}
          />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            {safeTranslate('password_reset_success', 'Password Reset Successful')}
          </Typography>
          <Alert 
            severity="success" 
            sx={{ 
              width: '100%', 
              borderRadius: 2,
              animation: 'fadeIn 0.4s ease-out',
            }}
          >
            {safeTranslate('password_reset_success_message', 'Your password has been reset successfully. Redirecting to login page...')}
          </Alert>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack 
      spacing={4}
      sx={{ 
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        width: '100%',
        maxWidth: { xs: '100%', sm: '450px' },
        mx: 'auto',
        px: { xs: 2, sm: 0 }
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box 
          component="img"
          src="/assets/Neged.png"
          alt="NIGED-EASE Logo"
          sx={{
            mb: { xs: 1, sm: 2 },
            width: { xs: 70, sm: 80 },
            height: { xs: 70, sm: 80 },
            borderRadius: '20%',
            objectFit: 'cover',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            border: '4px solid rgba(255, 255, 255, 0.8)',
            padding: 0.5,
            animation: 'pulse 2s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' },
              '50%': { boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)' },
              '100%': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }
            }
          }}
        />
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            textAlign: 'center',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          {safeTranslate('reset_password', 'Reset Password')}
        </Typography>
        <Typography 
          color="text.secondary" 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            maxWidth: '85%',
            mx: 'auto',
            opacity: 0.8,
            animation: 'fadeIn 0.5s ease-out 0.3s both',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {safeTranslate('reset_password_subtitle', 'Enter the OTP sent to your email and set a new password')}
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Box sx={{ position: 'relative' }}>
            <Button
              onClick={onBack}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                position: 'absolute',
                top: -50,
                left: 0,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {safeTranslate('back', 'Back')}
            </Button>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                left: -40, 
                top: 14,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            >
              <NumberCircleOne size={24} weight="fill" />
            </Box>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <FormControl error={Boolean(errors.otp)} variant="filled">
                  <InputLabel 
                    sx={{ 
                      '&.Mui-focused': { 
                        color: 'primary.main' 
                      } 
                    }}
                  >
                    {safeTranslate('otp_code', 'OTP Code')}
                  </InputLabel>
                  <OutlinedInput 
                    {...field} 
                    type="text"
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  {errors.otp ? <FormHelperText>{errors.otp.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Box sx={{ mt: 1, textAlign: 'right' }}>
              <Button 
                variant="text" 
                size="small" 
                onClick={handleResendOtp}
                sx={{ 
                  fontSize: '0.8rem', 
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                }}
              >
                {safeTranslate('resend_otp', 'Resend OTP')}
              </Button>
            </Box>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                left: -40, 
                top: 14,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            >
              <NumberCircleTwo size={24} weight="fill" />
            </Box>
            <Controller
              control={control}
              name="new_password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.new_password)} variant="filled">
                  <InputLabel 
                    sx={{ 
                      '&.Mui-focused': { 
                        color: 'primary.main' 
                      } 
                    }}
                  >
                    {safeTranslate('new_password', 'New Password')}
                  </InputLabel>
                  <OutlinedInput 
                    {...field} 
                    type={showPassword ? 'text' : 'password'}
                    startAdornment={
                      <Box 
                        component={Key} 
                        weight="duotone" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: 20, 
                          mr: 1 
                        }} 
                      />
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <EyeSlashIcon size={20} />
                          ) : (
                            <EyeIcon size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  {errors.new_password ? <FormHelperText>{errors.new_password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Box>

          <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirm_password)} variant="filled">
                <InputLabel 
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  {safeTranslate('confirm_password', 'Confirm Password')}
                </InputLabel>
                <OutlinedInput 
                  {...field} 
                  type={showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.confirm_password ? <FormHelperText>{errors.confirm_password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {errors.root ? (
            <Alert 
              severity={errors.root.message && errors.root.message.includes('resent') ? 'success' : 'error'}
              sx={{ 
                borderRadius: 2,
                animation: 'fadeIn 0.4s ease-out',
              }}
            >
              {errors.root.message || ''}
            </Alert>
          ) : null}

          <Button
            disabled={passwordResetConfirmMutation.isPending}
            type="submit"
            size="large"
            variant="contained"
            sx={{
              borderRadius: 2,
              py: 1.5,
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.6s ease',
              },
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                transform: 'translateY(-2px)',
                '&::before': {
                  left: '100%',
                }
              }
            }}
          >
            {passwordResetConfirmMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              safeTranslate('reset_password', 'Reset Password')
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

// Export both as default and named export
export { ResetPasswordForm };
export default ResetPasswordForm;
