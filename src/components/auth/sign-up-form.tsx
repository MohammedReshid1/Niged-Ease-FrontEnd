'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useRegister } from '@/hooks/use-auth-queries';
import { useAuth } from '@/providers/auth-provider';
import OtpVerificationForm from './otp-verification-form';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '', lastName: '', email: '', password: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const { saveEmail } = useAuth();
  const registerMutation = useRegister();

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
        await registerMutation.mutateAsync({
          email: values.email,
          password: values.password,
          first_name: values.firstName,
          last_name: values.lastName,
        });

        // Store email for OTP verification
        setUserEmail(values.email);
        saveEmail(values.email);
        
        // Show OTP verification form
        setShowOtpForm(true);
      } catch (error: any) {
        const errorMessage = error?.error || 'Registration failed. Please try again.';
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [registerMutation, saveEmail, setError]
  );

  // Function to go back to signup form from OTP verification
  const handleBackToSignup = React.useCallback(() => {
    setShowOtpForm(false);
  }, []);

  // If OTP form is visible, show it instead of signup form
  if (showOtpForm) {
    return <OtpVerificationForm email={userEmail} onBack={handleBackToSignup} />;
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1} alignItems="center">
        <Box 
          component="img"
          src="/assets/Neged.png"
          alt="NIGED-EASE Logo"
          sx={{
            mb: 2,
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Create Account
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          Join NIGED-EASE to manage your Ethiopian business efficiently
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)} variant="filled">
                <InputLabel>First name</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="First name" 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)} variant="filled">
                <InputLabel>Last name</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="Last name" 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} variant="filled">
                <InputLabel>Email address</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="Email address" 
                  type="email" 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} variant="filled">
                <InputLabel>Password</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="Password" 
                  type="password" 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      I have read the <Link>terms and conditions</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert color="error" severity="error" variant="filled">{errors.root.message}</Alert> : null}
          
          <Button 
            disabled={registerMutation.isPending} 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 2, 
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {registerMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Button 
              component={RouterLink} 
              href={paths.auth.signIn} 
              variant="outlined" 
              color="primary"
              sx={{ 
                borderRadius: 2, 
                py: 1,
                px: 3,
                fontWeight: 600
              }}
            >
              Sign In
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}
