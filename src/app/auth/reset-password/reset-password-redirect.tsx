'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { paths } from '@/paths';

export default function ResetPasswordRedirect(): React.JSX.Element {
  const router = useRouter();
  
  // Redirect to forgot password page
  React.useEffect(() => {
    router.replace(paths.auth.forgotPassword);
  }, [router]);
  
  // Show a loading spinner while redirecting
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}
    >
      <CircularProgress />
    </Box>
  );
} 