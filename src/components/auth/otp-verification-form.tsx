'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ShieldCheck, ArrowLeft, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/auth-provider';
import { useVerifyOtp, useResendOtp } from '@/hooks/use-auth-queries';
import tokenStorage from '@/utils/token-storage';

interface OtpVerificationFormProps {
  email: string;
  onBack: () => void;
}

export default function OtpVerificationForm({ email, onBack }: OtpVerificationFormProps): React.JSX.Element {
  const { t } = useTranslation('auth');
  const { verifyOtp } = useAuth();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const [countdown, setCountdown] = React.useState<number>(60);
  const [isResending, setIsResending] = React.useState<boolean>(false);

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

  // Update schema to use translations
  const schema = React.useMemo(() => zod.object({
    otp: zod.string()
      .min(6, { message: t('otp_validation') })
      .max(6, { message: t('otp_validation') })
      .regex(/^\d{6}$/, { message: t('otp_digits_only') }),
  }), [t]);

  type Values = zod.infer<typeof schema>;
  const defaultValues = { otp: '' } satisfies Values;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ 
    defaultValues, 
    resolver: zodResolver(schema)
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // Use a more complete type that includes stores
        interface OtpResponse {
          access: string;
          refresh: string;
          role: string;
          company_id: string;
          assigned_store?: any;
          stores?: any; // Can be array or single object
        }

        const response = await verifyOtpMutation.mutateAsync({
          email,
          otp: values.otp,
        }) as OtpResponse;

        // Log the role for debugging
        console.log('User role:', response.role);
        console.log('OTP verification response:', response);
        
        // Process stores data based on response format
        let storesArray: any[] = [];
        
        if (response.stores) {
          // Check if stores is an object (for stock_manager/sales) or array (for admin)
          if (Array.isArray(response.stores)) {
            storesArray = response.stores;
          } else {
            // For stock manager and sales, stores is a single object
            storesArray = [response.stores];
          }
          
          console.log('Processed stores:', storesArray);
          // Save all available stores
          tokenStorage.saveCompanyStores(storesArray);
          
          // If there's no assigned store but there are stores available, use the first one
          if (!response.assigned_store && 
              (response.role === 'sales' || response.role === 'stock_manager') && 
              storesArray.length > 0) {
            console.log('Using first available store as assigned store:', storesArray[0]);
            tokenStorage.saveAssignedStore(storesArray[0]);
          }
        }
        
        // For all user roles, check and save the assigned store information
        if (response.assigned_store) {
          console.log('Saving assigned store:', response.assigned_store);
          // Save the assigned store in token storage
          tokenStorage.saveAssignedStore(response.assigned_store);
        }
        
        // Complete the verification process
        verifyOtp(email, values.otp, storesArray, response.assigned_store);
      } catch (error: any) {
        const errorMessage = error?.error || t('invalid_otp');
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [email, verifyOtp, setError, verifyOtpMutation, t]
  );

  const handleResendOtp = React.useCallback(async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    
    try {
      await resendOtpMutation.mutateAsync({ email });
      // Reset countdown
      setCountdown(60);
    } catch (error: any) {
      const errorMessage = error?.error || t('failed_resend');
      setError('root', { type: 'server', message: errorMessage });
    } finally {
      setIsResending(false);
    }
  }, [countdown, email, isResending, resendOtpMutation, setError, t]);

  return (
    <Stack 
      spacing={4}
      sx={{ 
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(99, 102, 241, 0.1))',
            mb: 2,
            position: 'relative',
            animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
            '@keyframes pulse-ring': {
              '0%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)'
              },
              '70%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 15px rgba(99, 102, 241, 0)'
              },
              '100%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)'
              }
            }
          }}
        >
          <ShieldCheck 
            size={56} 
            weight="duotone" 
            color="var(--mui-palette-primary-main)" 
          />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            textAlign: 'center',
            background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('verify_account')}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            animation: 'fadeIn 0.5s ease-out 0.2s both',
          }}
        >
          <EnvelopeSimple 
            size={20} 
            weight="duotone" 
            style={{ 
              marginRight: 8,
              color: 'var(--mui-palette-text-secondary)'
            }}
          />
          <Typography 
            color="text.secondary" 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {email}
          </Typography>
        </Box>
        <Typography 
          color="text.secondary" 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            opacity: 0.8,
            animation: 'fadeIn 0.5s ease-out 0.3s both',
            maxWidth: '90%',
            mx: 'auto'
          }}
        >
          {t('verification_sent')}
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
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
                  6-digit verification code
                </InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="6-digit verification code" 
                  type="text" 
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  startAdornment={
                    <ShieldCheck 
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
                    height: 56,
                    fontSize: '1.1rem',
                    letterSpacing: 2,
                    textAlign: 'center',
                    '& input': {
                      textAlign: 'center'
                    },
                    animation: 'fadeInUp 0.6s ease-out both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', letterSpacing: '0.5em' }
                  }}
                />
                {errors.otp ? 
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
                    {errors.otp.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          
          {errors.root ? 
            <Alert 
              color="error" 
              severity="error" 
              variant="filled"
              sx={{ 
                borderRadius: 2,
                animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
              }}
            >
              {errors.root.message}
            </Alert> 
          : null}
          
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            disabled={verifyOtpMutation.isPending}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.1)',
            }}
          >
            {verifyOtpMutation.isPending ? 
              <CircularProgress size={24} color="inherit" /> : 
              t('verify_continue')
            }
          </Button>
          
          <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                animation: 'fadeIn 0.5s ease-out 0.5s both',
                textAlign: 'center',
              }}
            >
              {countdown > 0 ? (
                <>
                  {t('didnt_receive_code')} <b>{countdown}s</b>
                </>
              ) : (
                t('didnt_receive_code_try')
              )}
            </Typography>
            
            <Box sx={{ width: '100%', animation: 'fadeIn 0.5s ease-out 0.6s both' }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isResending}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                {t('resend_code')}
              </Button>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ animation: 'fadeIn 0.5s ease-out 0.7s both' }}>
            <Button
              startIcon={<ArrowLeft weight="bold" />}
              onClick={onBack}
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              {t('back_to_login')}
            </Button>
          </Stack>
        </Stack>
      </form>

      {resendOtpMutation.error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {t('failed_resend')}
        </Alert>
      )}
    </Stack>
  );
} 