import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiSnackbar = {
  styleOverrides: {
    root: {
      maxWidth: '100%',
      '@media (min-width: 600px)': {
        maxWidth: '440px',
      },
    },
  },
} satisfies Components<Theme>['MuiSnackbar'];

export const MuiSnackbarContent = {
  styleOverrides: {
    root: {
      padding: '12px 16px',
      backgroundColor: 'var(--mui-palette-neutral-900)',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
    },
    message: {
      padding: 0,
      fontWeight: 500,
    },
    action: {
      marginRight: -8,
    },
  },
} satisfies Components<Theme>['MuiSnackbarContent']; 