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
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Envelope, Key } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useLogin } from '@/hooks/use-auth-queries';
import { useAuth } from '@/providers/auth-provider';
import OtpVerificationForm from './otp-verification-form';

export function SignInForm(): React.JSX.Element {
  const { t, i18n } = useTranslation('auth');
  
  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    const result = t(key);
    // If the result is the same as the key, it means translation failed
    return result === key ? fallback : result;
  };
  
  const schema = zod.object({
    email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: zod.string().min(1, { message: 'Password is required' }),
  });

  type Values = zod.infer<typeof schema>;

  const defaultValues = { email: '', password: '' } satisfies Values;

  const router = useRouter();
  const { saveEmail } = useAuth();
  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showOtpForm, setShowOtpForm] = React.useState<boolean>(false);
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
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });

        // Store email for OTP verification
        setUserEmail(values.email);
        saveEmail(values.email);
        
        // Show OTP verification form
        setShowOtpForm(true);
      } catch (error: any) {
        const errorMessage = error?.error || t('invalid_credentials');
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [loginMutation, saveEmail, setError, t]
  );

  // Function to go back to login form from OTP verification
  const handleBackToLogin = React.useCallback(() => {
    setShowOtpForm(false);
  }, []);

  // If OTP form is visible, show it instead of login form
  if (showOtpForm) {
    return <OtpVerificationForm email={userEmail} onBack={handleBackToLogin} />;
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
          {safeTranslate('welcome_back', 'Welcome Back')}
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
          {safeTranslate('sign_in_subtitle', 'Sign in to your account to continue')}
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
                  label={safeTranslate('email_address', 'Email Address')} 
                  type="email" 
                  startAdornment={
                    <Envelope 
                      style={{ marginRight: 12 }} 
                      size={22} 
                      weight="duotone"
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  sx={{ 
                    borderRadius: 2.5,
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.2)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    height: { xs: 52, sm: 56 },
                    animation: 'fadeInUp 0.6s ease-out both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                />
                {errors.email ? 
                  <FormHelperText 
                    sx={{ 
                      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                      '@keyframes shake': {
                        '10%, 90%': { transform: 'translateX(-1px)' },
                        '20%, 80%': { transform: 'translateX(2px)' },
                        '30%, 50%, 70%': { transform: 'translateX(-4px)' },
                        '40%, 60%': { transform: 'translateX(4px)' }
                      }
                    }}
                  >
                    {errors.email.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} variant="filled">
                <InputLabel
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  {t('password')}
                </InputLabel>
                <OutlinedInput
                  {...field}
                  startAdornment={
                    <Key 
                      style={{ marginRight: 12 }} 
                      size={22} 
                      weight="duotone"
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        size={22}
                        weight="duotone"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        size={22}
                        weight="duotone"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  sx={{ 
                    borderRadius: 2.5,
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.2)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    height: { xs: 52, sm: 56 },
                    animation: 'fadeInUp 0.6s ease-out 0.2s both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                />
                {errors.password ? 
                  <FormHelperText 
                    sx={{ 
                      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                      '@keyframes shake': {
                        '10%, 90%': { transform: 'translateX(-1px)' },
                        '20%, 80%': { transform: 'translateX(2px)' },
                        '30%, 50%, 70%': { transform: 'translateX(-4px)' },
                        '40%, 60%': { transform: 'translateX(4px)' }
                      }
                    }}
                  >
                    {errors.password.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          <Link
            component={RouterLink}
            href={paths.auth.forgotPassword}
            sx={{ 
              alignSelf: 'flex-end',
              color: 'primary.main',
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: 'primary.dark',
                textDecoration: 'underline'
              },
              animation: 'fadeInUp 0.6s ease-out 0.4s both',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
            underline="none"
            variant="subtitle2"
          >
            {t('forgot_password')}
          </Link>
          {errors.root ? (
            <Alert 
              severity="error"
              variant="filled"
              sx={{ 
                borderRadius: 2,
                animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                '@keyframes shake': {
                  '10%, 90%': { transform: 'translateX(-1px)' },
                  '20%, 80%': { transform: 'translateX(2px)' },
                  '30%, 50%, 70%': { transform: 'translateX(-4px)' },
                  '40%, 60%': { transform: 'translateX(4px)' }
                }
              }}
            >
              {errors.root.message}
            </Alert>
          ) : null}
          <Button
            disabled={loginMutation.isPending}
            type="submit"
            size="large"
            variant="contained"
            sx={{ 
              height: { xs: '50px', sm: '56px' },
              borderRadius: 2.5,
              position: 'relative',
              overflow: 'hidden',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.6s ease-out 0.6s both',
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
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                transform: 'translateY(-2px)',
                '&::before': {
                  left: '100%',
                }
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            {loginMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('sign_in')
            )}
          </Button>
          <Typography
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mt: { xs: 2, sm: 3 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' }
            }}
            variant="body2"
          >
            {t('dont_have_account')}{' '}
            <Link
              component={RouterLink}
              href={paths.auth.signUp}
              sx={{ 
                color: 'primary.main',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.dark',
                  textDecoration: 'underline'
                }
              }}
              underline="none"
              variant="subtitle2"
            >
              {t('sign_up')}
            </Link>
          </Typography>
        </Stack>
      </form>
    </Stack>
  );
}
