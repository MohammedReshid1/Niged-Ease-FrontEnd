'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { useAuth } from '@/providers/auth-provider';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const checkPermissions = React.useCallback(() => {
    if (isAuthenticated) {
      console.log('[GuestGuard]: User is authenticated, redirecting to appropriate dashboard');
      
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
  }, [isAuthenticated, userRole, router]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error" severity="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
