'use client';

import * as React from 'react';
import { RoleGuard } from './role-guard';

export interface SalesmanGuardProps {
  children: React.ReactNode;
}

export function SalesmanGuard({ children }: SalesmanGuardProps): React.JSX.Element {
  return <RoleGuard allowedRoles={['sales', 'admin', 'super_admin']}>{children}</RoleGuard>;
} 