'use client';

import * as React from 'react';
import { RoleGuard } from './role-guard';

export interface StockManagerGuardProps {
  children: React.ReactNode;
}

export function StockManagerGuard({ children }: StockManagerGuardProps): React.JSX.Element {
  return <RoleGuard allowedRoles={['stock_manager', 'admin', 'super_admin']}>{children}</RoleGuard>;
} 