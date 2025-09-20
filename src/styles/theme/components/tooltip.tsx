import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTooltip = {
  defaultProps: {
    arrow: true,
    placement: 'top',
  },
  styleOverrides: {
    tooltip: ({ theme }) => {
      return {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.9)'
          : 'rgba(15, 23, 42, 0.9)',
        color: '#ffffff',
        fontSize: '0.75rem',
        padding: '8px 12px',
        borderRadius: '6px',
        maxWidth: '300px',
        boxShadow: theme.shadows[4],
        fontWeight: 500,
        lineHeight: 1.5,
      };
    },
    arrow: ({ theme }) => {
      return {
        color: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.9)'
          : 'rgba(15, 23, 42, 0.9)',
      };
    },
  },
} satisfies Components<Theme>['MuiTooltip']; 