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
import { Envelope } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useAuth } from '@/providers/auth-provider';
import { ResetPasswordForm } from './reset-password-form';
import { useRequestPasswordReset } from '@/hooks/use-password-reset';

// Define the form schema
const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email format'),
});

type Values = zod.infer<typeof schema>;

export function ForgotPasswordForm(): React.JSX.Element {
  const { t, i18n } = useTranslation('auth');
  const router = useRouter();
  const requestPasswordResetMutation = useRequestPasswordReset();
  
  // Safe translation function to handle missing translations
  const safeTranslate = (key: string, fallback: string): string => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const defaultValues = { email: '' } satisfies Values;

  const [showResetForm, setShowResetForm] = React.useState<boolean>(false);
  const [userEmail, setUserEmail] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        await requestPasswordResetMutation.mutateAsync({ email: values.email });
        
        // Store email for reset password form
        setUserEmail(values.email);
        
        // Show reset password form
        setShowResetForm(true);
      } catch (error: any) {
        const errorMessage = error?.error || safeTranslate('user_not_found', 'User not found');
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [requestPasswordResetMutation, setError, safeTranslate]
  );

  // Function to go back to forgot password form from reset password form
  const handleBackToForgotPassword = React.useCallback(() => {
    setShowResetForm(false);
  }, []);

  // If reset password form is visible, show it instead of forgot password form
  if (showResetForm) {
    return <ResetPasswordForm email={userEmail} onBack={handleBackToForgotPassword} />;
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
          {safeTranslate('forgot_password', 'Forgot Password')}
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
          {safeTranslate('forgot_password_subtitle', 'Enter your email to reset your password')}
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} variant="filled">
                <InputLabel 
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  {safeTranslate('email_address', 'Email Address')}
                </InputLabel>
                <OutlinedInput 
                  {...field} 
                  type="email"
                  startAdornment={
                    <Box 
                      component={Envelope} 
                      weight="duotone" 
                      sx={{ 
                        color: 'text.secondary', 
                        fontSize: 20, 
                        mr: 1 
                      }} 
                    />
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
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {errors.root ? (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                animation: 'fadeIn 0.4s ease-out',
              }}
            >
              {errors.root.message}
            </Alert>
          ) : null}

          <Button
            disabled={requestPasswordResetMutation.isPending}
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
            {requestPasswordResetMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              safeTranslate('reset_password', 'Reset Password')
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              underline="hover"
              variant="body2"
              sx={{ 
                color: 'primary.main',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              {safeTranslate('back_to_login', 'Back to Login')}
            </Link>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
} 