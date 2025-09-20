import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiBackdrop = {
  styleOverrides: {
    root: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(3px)',
      transition: 'opacity 0.3s ease-in-out',
    },
    invisible: {
      backgroundColor: 'transparent',
      backdropFilter: 'none',
    },
  },
} satisfies Components<Theme>['MuiBackdrop']; 