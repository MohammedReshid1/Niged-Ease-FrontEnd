'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { UserPopover } from '@/components/dashboard/layout/user-popover';
import { MobileNav } from './mobile-nav';
import { useAuth } from '@/providers/auth-provider';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { userInfo } = useAuth();
  const userPopover = usePopover<HTMLDivElement>();

  // Generate user initials from name or email
  const userInitials = React.useMemo(() => {
    if (userInfo?.first_name && userInfo?.last_name) {
      return `${userInfo.first_name.charAt(0)}${userInfo.last_name.charAt(0)}`.toUpperCase();
    }
    
    if (userInfo?.first_name) {
      return userInfo.first_name.charAt(0).toUpperCase();
    }
    
    if (!userInfo?.email) return 'U';
    
    const namePart = userInfo.email.split('@')[0];
    if (!namePart) return 'U';
    
    // Format initials from name parts (e.g., john.doe -> JD)
    return namePart
      .split(/[._-]/)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }, [userInfo?.email, userInfo?.first_name, userInfo?.last_name]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid rgba(203, 213, 225, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'fixed',
          top: 0,
          left: {
            xs: 0,
            lg: 'var(--SideNav-width)',
          },
          right: 0,
          height: 'var(--MainNav-height)',
          zIndex: 'var(--MainNav-zIndex)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            height: '100%',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ alignItems: 'center', display: { lg: 'none', xs: 'flex' } }}>
            <IconButton
              onClick={(): void => setOpenNav(true)}
              aria-label="Menu"
              sx={{ 
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                color: '#14B8A6',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(20, 184, 166, 0.05)',
                  transform: 'translateY(-2px)',
                  borderColor: 'rgba(20, 184, 166, 0.4)',
                }
              }}
            >
              <ListIcon weight="bold" />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1 }}></Box>
          <Stack
            alignItems="center"
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ alignItems: 'center', flex: '0 0 auto' }}
          >
            <LanguageSwitcher />
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={userInfo?.profile_image || undefined}
              sx={{
                cursor: 'pointer',
                height: 42,
                width: 42,
                border: '2px solid rgba(20, 184, 166, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
                  border: '2px solid rgba(20, 184, 166, 0.5)',
                }
              }}
            >
              {userInitials}
            </Avatar>
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
} 