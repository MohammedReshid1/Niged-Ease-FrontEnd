'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { useAuth } from '@/providers/auth-provider';
import StoreSelector from '@/components/admin/store-selector';

import { MobileNav } from './mobile-nav';
import { UserPopover } from '@/components/dashboard/layout/user-popover';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { userInfo } = useAuth();
  const userPopover = usePopover<HTMLDivElement>();

  // Generate user initials from email
  const userInitials = React.useMemo(() => {
    if (!userInfo?.email) return '';
    
    const namePart = userInfo.email.split('@')[0];
    if (namePart) {
      // Get initials from name parts
      return namePart
        .split(/[._-]/)
        .map((part: string) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    }
    
    return userInfo.email.substring(0, 2).toUpperCase();
  }, [userInfo?.email]);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderBottomColor: 'var(--mui-palette-divider)',
          borderBottomStyle: 'solid',
          borderBottomWidth: 1,
          color: 'var(--mui-palette-text-primary)',
          height: 'var(--MainNav-height)',
          left: {
            xs: 0,
            lg: 'var(--SideNav-width)',
          },
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 'var(--MainNav-zIndex)',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ height: '100%', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ alignItems: 'center', display: { lg: 'none', xs: 'flex' } }}>
            <IconButton 
              onClick={(): void => setOpenNav(true)}
              aria-label="Menu"
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListIcon weight="bold" />
            </IconButton>
          </Box>
          <Stack
            alignItems="center"
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ alignItems: 'center', flex: '1 1 auto', justifyContent: 'space-between' }}
          >
            <StoreSelector />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <LanguageSwitcher />
              <Box ref={userPopover.anchorRef}>
                <Avatar
                  onClick={userPopover.handleOpen}
                  ref={userPopover.anchorRef}
                  src={userInfo?.profile_image || undefined}
                  sx={{
                    cursor: 'pointer',
                    height: 40,
                    width: 40
                  }}
                >
                  {userInitials}
                </Avatar>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <MobileNav onClose={(): void => setOpenNav(false)} open={openNav} />
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
    </>
  );
} 