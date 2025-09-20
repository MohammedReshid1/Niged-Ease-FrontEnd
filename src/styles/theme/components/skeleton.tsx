import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiSkeleton = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(15, 23, 42, 0.05)',
        borderRadius: '4px',
        '&.MuiSkeleton-text': {
          transform: 'scale(1, 0.8)',
        },
        '&::after': {
          background: `linear-gradient(90deg, 
                      transparent, 
                      ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.09)'}, 
                      transparent)`,
        },
      };
    },
    circular: {
      borderRadius: '50%',
    },
    rectangular: {
      borderRadius: '4px',
    },
    rounded: {
      borderRadius: '8px',
    },
  },
} satisfies Components<Theme>['MuiSkeleton']; 