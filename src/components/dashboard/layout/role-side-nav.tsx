'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/use-auth';
import { SideNav as DashboardSideNav } from '@/components/dashboard/layout/side-nav';
import { SideNav as AdminSideNav } from '@/components/admin/layout/side-nav';
import { SideNav as SuperAdminSideNav } from '@/components/super-admin/layout/side-nav';
import { SideNav as SalesmanSideNav } from '@/components/salesman/layout/side-nav';
import { SideNav as StockManagerSideNav } from '@/components/stock-manager/layout/side-nav';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export function RoleSideNav(): React.JSX.Element {
  const { userInfo, isLoading } = useCurrentUser();
  
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: 'var(--SideNav-width)',
          position: 'fixed',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }
  
  // Return the appropriate side nav based on user role
  switch (userInfo?.role) {
    case 'admin':
      return <AdminSideNav />;
    case 'super_admin':
      return <SuperAdminSideNav />;
    case 'sales':
      return <SalesmanSideNav />;
    case 'stock_manager':
      return <StockManagerSideNav />;
    default:
      return <DashboardSideNav />;
  }
} 