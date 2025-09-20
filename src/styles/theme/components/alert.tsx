import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiAlert = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: {
      borderRadius: '8px',
      padding: '12px 16px',
      alignItems: 'center',
      boxShadow: 'none',
    },
    standardSuccess: {
      backgroundColor: 'var(--mui-palette-success-50)',
      color: 'var(--mui-palette-success-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-success-500)',
      },
    },
    standardInfo: {
      backgroundColor: 'var(--mui-palette-info-50)',
      color: 'var(--mui-palette-info-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-info-500)',
      },
    },
    standardWarning: {
      backgroundColor: 'var(--mui-palette-warning-50)',
      color: 'var(--mui-palette-warning-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-warning-500)',
      },
    },
    standardError: {
      backgroundColor: 'var(--mui-palette-error-50)',
      color: 'var(--mui-palette-error-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-error-500)',
      },
    },
    outlinedSuccess: {
      borderColor: 'var(--mui-palette-success-200)',
      color: 'var(--mui-palette-success-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-success-500)',
      },
    },
    outlinedInfo: {
      borderColor: 'var(--mui-palette-info-200)',
      color: 'var(--mui-palette-info-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-info-500)',
      },
    },
    outlinedWarning: {
      borderColor: 'var(--mui-palette-warning-200)',
      color: 'var(--mui-palette-warning-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-warning-500)',
      },
    },
    outlinedError: {
      borderColor: 'var(--mui-palette-error-200)',
      color: 'var(--mui-palette-error-700)',
      '& .MuiAlert-icon': {
        color: 'var(--mui-palette-error-500)',
      },
    },
    icon: {
      fontSize: '1.25rem',
      marginRight: '12px',
    },
    message: {
      padding: 0,
      fontWeight: 500,
    },
    action: {
      paddingTop: 0,
      paddingRight: 4,
      paddingBottom: 0,
      marginLeft: 'auto',
    },
  },
} satisfies Components<Theme>['MuiAlert']; 