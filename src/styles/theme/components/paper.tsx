import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiPaper = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        backgroundImage: 'none',
        borderRadius: '12px',
        transition: 'box-shadow 0.2s ease-in-out',
        '&.MuiPaper-elevation0': {
          boxShadow: 'none',
        },
        '&.MuiPaper-elevation1': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 8px 0 rgba(0, 0, 0, 0.3)'
              : '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        },
        '&.MuiPaper-elevation2': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 12px 0 rgba(0, 0, 0, 0.4)'
              : '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        },
        '&.MuiPaper-elevation4': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 24px 0 rgba(0, 0, 0, 0.4)'
              : '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        },
      };
    },
  },
} satisfies Components<Theme>['MuiPaper']; 