import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiChip = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        fontWeight: 500,
        '&:hover': {
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      };
    },
    colorPrimary: {
      backgroundColor: 'var(--mui-palette-primary-50)',
      color: 'var(--mui-palette-primary-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-primary-100)',
      },
    },
    colorSecondary: {
      backgroundColor: 'var(--mui-palette-secondary-50)',
      color: 'var(--mui-palette-secondary-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-secondary-100)',
      },
    },
    colorSuccess: {
      backgroundColor: 'var(--mui-palette-success-50)',
      color: 'var(--mui-palette-success-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-success-100)',
      },
    },
    colorError: {
      backgroundColor: 'var(--mui-palette-error-50)',
      color: 'var(--mui-palette-error-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-error-100)',
      },
    },
    colorInfo: {
      backgroundColor: 'var(--mui-palette-info-50)',
      color: 'var(--mui-palette-info-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-info-100)',
      },
    },
    colorWarning: {
      backgroundColor: 'var(--mui-palette-warning-50)',
      color: 'var(--mui-palette-warning-700)',
      '&:hover': {
        backgroundColor: 'var(--mui-palette-warning-100)',
      },
    },
    deleteIcon: {
      color: 'inherit',
      opacity: 0.7,
      '&:hover': {
        opacity: 1,
        color: 'inherit',
      },
    },
    label: {
      fontSize: '0.8125rem',
      padding: '0 12px',
    },
  },
} satisfies Components<Theme>['MuiChip']; 