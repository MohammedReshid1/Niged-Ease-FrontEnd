import type { Metadata } from 'next';
import { config } from '@/config';
import ResetPasswordRedirect from './reset-password-redirect';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ResetPasswordRedirect />;
}
