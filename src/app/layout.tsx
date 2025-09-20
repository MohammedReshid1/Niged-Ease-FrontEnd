'use client';

import * as React from 'react';
import type { Viewport } from 'next';
import { SnackbarProvider } from 'notistack';
import { useTranslation } from 'react-i18next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { StoreProvider } from '@/providers/store-provider';
import { QueryProvider } from '@/providers/query-provider';
import { I18nProvider } from '@/providers/i18n-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <I18nProvider>
      <LanguageAwarePage>
        <LocalizationProvider>
          <AuthProvider>
            <QueryProvider>
              <StoreProvider>
                <UserProvider>
                  <ThemeProvider>
                    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                      {children}
                    </SnackbarProvider>
                  </ThemeProvider>
                </UserProvider>
              </StoreProvider>
            </QueryProvider>
          </AuthProvider>
        </LocalizationProvider>
      </LanguageAwarePage>
    </I18nProvider>
  );
}

// Component to set the correct language on the html element
function LanguageAwarePage({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  
  // Set the language on the html tag
  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
    console.log('Setting document language to:', i18n.language);
  }, [i18n.language]);
  
  return (
    <html lang={i18n.language}>
      <head>
        <title>NIGED-EASE | Business Management</title>
        <meta name="description" content="Modern business management solution for Ethiopian businesses" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
