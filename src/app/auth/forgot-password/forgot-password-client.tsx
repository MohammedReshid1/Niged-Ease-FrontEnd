'use client';

import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordClient(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ForgotPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
