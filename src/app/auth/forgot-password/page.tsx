import type { Metadata } from 'next';
import { config } from '@/config';
import ForgotPasswordClient from './forgot-password-client';

export const metadata = { title: `Forgot password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ForgotPasswordClient />;
} 