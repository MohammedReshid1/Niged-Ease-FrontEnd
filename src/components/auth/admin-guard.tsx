'use client';

import * as React from 'react';
import { RoleGuard } from './role-guard';

export interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps): React.JSX.Element {
  return <RoleGuard allowedRoles={['admin', 'super_admin']}>{children}</RoleGuard>;
} 