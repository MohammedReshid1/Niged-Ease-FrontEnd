import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiSwitch = {
  styleOverrides: {
    root: {
      width: 46,
      height: 24,
      padding: 0,
      margin: 8,
    },
    switchBase: {
      padding: 4,
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: 'var(--mui-palette-primary-500)',
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: 'var(--mui-palette-primary-500)',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: 'none',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s',
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      },
    },
    track: {
      borderRadius: 12,
      opacity: 1,
      backgroundColor: 'var(--mui-palette-neutral-300)',
      boxSizing: 'border-box',
      transition: 'background-color 0.2s',
    },
  },
} satisfies Components<Theme>['MuiSwitch']; 