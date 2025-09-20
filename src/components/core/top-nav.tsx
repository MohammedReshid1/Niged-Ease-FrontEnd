'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { UserCircle as UserCircleIcon } from '@phosphor-icons/react/dist/ssr/UserCircle';
import { StoreSelector } from './store-selector';

export interface TopNavProps {
  onNavOpen?: () => void;
}

export function TopNav({ onNavOpen }: TopNavProps): React.JSX.Element {
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'var(--mui-palette-background-paper)',
        borderBottom: '1px solid var(--mui-palette-divider)',
        position: 'fixed',
        width: '100%',
        zIndex: 'var(--TopNav-zIndex)',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          minHeight: 64,
          px: 2,
          py: 1,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          <IconButton
            onClick={onNavOpen}
            sx={{
              display: {
                lg: 'none',
              },
            }}
          >
            <ListIcon />
          </IconButton>
          <Box
            sx={{
              display: {
                xs: 'none',
                lg: 'block',
              },
            }}
          >
            <StoreSelector />
          </Box>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Box
            sx={{
              display: {
                xs: 'block',
                lg: 'none',
              },
            }}
          >
            <StoreSelector />
          </Box>
          <IconButton>
            <BellIcon />
          </IconButton>
          <IconButton>
            <UserCircleIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
} 