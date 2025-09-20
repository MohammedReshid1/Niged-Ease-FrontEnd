import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiDialog = {
  styleOverrides: {
    paper: {
      borderRadius: '16px',
      boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.18)',
      backgroundImage: 'none',
    },
  },
} satisfies Components<Theme>['MuiDialog'];

export const MuiDialogTitle = {
  styleOverrides: {
    root: {
      fontSize: '1.25rem',
      fontWeight: 600,
      padding: '24px 24px 16px',
    },
  },
} satisfies Components<Theme>['MuiDialogTitle'];

export const MuiDialogContent = {
  styleOverrides: {
    root: {
      padding: '16px 24px',
    },
  },
} satisfies Components<Theme>['MuiDialogContent'];

export const MuiDialogActions = {
  styleOverrides: {
    root: {
      padding: '16px 24px 24px',
    },
  },
} satisfies Components<Theme>['MuiDialogActions']; 