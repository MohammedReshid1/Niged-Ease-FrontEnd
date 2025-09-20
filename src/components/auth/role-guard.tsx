'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { Box, CircularProgress, Typography } from '@mui/material';

import { paths } from '@/paths';
import { useAuth } from '@/providers/auth-provider';

export type AllowedRole = 'super_admin' | 'admin' | 'sales' | 'stock_manager';

export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, userRole, isInitialized, isLoading } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const checkPermissions = React.useCallback(() => {
    // Only check after initialization and when not loading
    if (!isInitialized || isLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      console.log('[RoleGuard]: User is not authenticated, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    if (!userRole) {
      setError('Unable to verify user role. Please try logging in again.');
      setIsChecking(false);
      return;
    }

    if (!allowedRoles.includes(userRole as AllowedRole)) {
      console.log(`[RoleGuard]: User role ${userRole} is not allowed, redirecting to appropriate dashboard`);
      
      // Redirect based on role
      if (userRole === 'super_admin') {
        router.replace(paths.superAdmin.dashboard);
      } else if (userRole === 'admin') {
        router.replace(paths.admin.dashboard);
      } else if (userRole === 'sales') {
        router.replace(paths.salesman.dashboard);
      } else if (userRole === 'stock_manager') {
        router.replace(paths.stockManager.dashboard);
      } else {
        router.replace(paths.dashboard.overview);
      }
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, userRole, allowedRoles, router, isInitialized, isLoading]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Show loading indicator during initialization or loading
  if (!isInitialized || isLoading || isChecking) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <Box sx={{
          borderRadius: '16px',
          padding: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <CircularProgress size={48} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Verifying permissions...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we check your access rights
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return <Alert color="error" severity="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
} 