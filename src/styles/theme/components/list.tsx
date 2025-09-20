import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiList = {
  styleOverrides: {
    root: {
      padding: '8px',
    },
  },
} satisfies Components<Theme>['MuiList'];

export const MuiListItem = {
  styleOverrides: {
    root: {
      borderRadius: '8px',
      marginBottom: '2px',
      '&.Mui-selected': {
        backgroundColor: 'var(--mui-palette-primary-100)',
      },
    },
  },
} satisfies Components<Theme>['MuiListItem'];

export const MuiListItemButton = {
  styleOverrides: {
    root: {
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-action-hover)',
        transform: 'translateX(4px)',
      },
      '&.Mui-selected': {
        backgroundColor: 'var(--mui-palette-primary-50)',
        '&:hover': {
          backgroundColor: 'var(--mui-palette-primary-100)',
        },
      },
    },
  },
} satisfies Components<Theme>['MuiListItemButton'];

export const MuiListItemIcon = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-secondary)',
      minWidth: '40px',
    },
  },
} satisfies Components<Theme>['MuiListItemIcon'];

export const MuiListItemText = {
  styleOverrides: {
    primary: {
      fontWeight: 500,
    },
    secondary: {
      color: 'var(--mui-palette-text-secondary)',
      fontSize: '0.75rem',
    },
  },
} satisfies Components<Theme>['MuiListItemText']; 