import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTableCell = {
  styleOverrides: {
    root: {
      borderBottom: '1px solid var(--mui-palette-divider)',
      padding: '16px',
    },
    head: ({ theme }) => {
      return {
        color: theme.palette.text.secondary,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
      };
    },
  },
} satisfies Components<Theme>['MuiTableCell'];
