import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Metadata } from 'next';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/admin/layout/main-nav';
import { SideNav } from '@/components/admin/layout/side-nav';
import { AdminProvider } from '@/contexts/admin-context';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Nigedease Admin',
  },
  description: 'Nigedease Admin Dashboard and Management System',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <AdminProvider>
        <GlobalStyles
          styles={{
            'html, body': {
              height: '100%',
            },
            body: {
              '--MainNav-height': '70px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '280px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '90vw',
              '--MobileNav-max-width': '320px',
              '--MobileNav-zIndex': 1200,
              margin: 0,
              padding: 0,
              overflow: 'hidden',
              WebkitTapHighlightColor: 'transparent',
            },
            '#__next, main': {
              height: '100%',
            },
            'h1, .MuiTypography-h1': {
              fontSize: 'clamp(2rem, 4vw, 2.5rem) !important',
              lineHeight: '1.2 !important',
            },
            'h2, .MuiTypography-h2': {
              fontSize: 'clamp(1.75rem, 3vw, 2rem) !important',
              lineHeight: '1.2 !important',
            },
            'h3, .MuiTypography-h3': {
              fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem) !important',
              lineHeight: '1.3 !important',
            },
            'h4, .MuiTypography-h4': {
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem) !important',
              lineHeight: '1.4 !important',
            },
            'h5, .MuiTypography-h5': {
              fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem) !important',
              lineHeight: '1.4 !important',
            },
            'h6, .MuiTypography-h6': {
              fontSize: 'clamp(1rem, 1.25vw, 1.125rem) !important',
              lineHeight: '1.5 !important',
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            overflow: 'hidden',
          }}
        >
          <SideNav />
          <Box 
            sx={{ 
              display: 'flex', 
              flex: '1 1 auto', 
              flexDirection: 'column', 
              pl: { lg: 'var(--SideNav-width)' },
              pt: { xs: 'var(--MainNav-height)', lg: 'var(--MainNav-height)' },
              transition: 'padding-left 0.3s ease-in-out',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <MainNav />
            <Box 
              component="main"
              sx={{
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  }
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent',
              }}
            >
              <Container 
                maxWidth="xl" 
                sx={{ 
                  py: { xs: '16px', sm: '24px', md: '40px' },
                  px: { xs: '12px', sm: '16px', md: '24px' },
                }}
              >
                <Box
                  sx={{
                    borderRadius: { xs: '16px', sm: '24px' },
                    overflow: 'hidden',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    position: 'relative',
                    padding: { xs: '12px', sm: '16px', md: '24px' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      zIndex: -1,
                      margin: '-1px',
                      borderRadius: 'inherit',
                      background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.15), rgba(99, 102, 241, 0.15))',
                    },
                  }}
                >
                  {children}
                </Box>
              </Container>
            </Box>
          </Box>
        </Box>
      </AdminProvider>
    </AuthGuard>
  );
} 