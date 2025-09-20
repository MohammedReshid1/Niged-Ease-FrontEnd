import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiInputBase = {
  styleOverrides: {
    root: {
      borderRadius: '12px',
      transition: 'all 0.2s ease-in-out',
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(6, 148, 162, 0.15)',
      },
    },
    input: {
      '&::placeholder': {
        opacity: 0.7,
      },
    },
  },
} satisfies Components<Theme>['MuiInputBase'];

export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      borderRadius: '12px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--mui-palette-primary-light)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1.5px',
        borderColor: 'var(--mui-palette-primary-main)',
      },
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      '&.Mui-focused': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(6, 148, 162, 0.1)',
      },
    },
    notchedOutline: {
      borderColor: 'var(--mui-palette-divider)',
      transition: 'border-color 0.2s ease-in-out',
    },
    input: {
      padding: '14px 16px',
    },
  },
} satisfies Components<Theme>['MuiOutlinedInput']; 