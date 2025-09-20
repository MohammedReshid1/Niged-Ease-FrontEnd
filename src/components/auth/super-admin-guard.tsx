'use client';

import * as React from 'react';
import { RoleGuard } from './role-guard';

export interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps): React.JSX.Element {
  return <RoleGuard allowedRoles={['super_admin']}>{children}</RoleGuard>;
} 