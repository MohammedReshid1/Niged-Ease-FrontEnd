import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiFormLabel = {
  styleOverrides: {
    root: {
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '4px',
      color: 'var(--mui-palette-text-primary)',
      '&.Mui-focused': {
        color: 'var(--mui-palette-primary-main)',
      },
      '&.Mui-error': {
        color: 'var(--mui-palette-error-main)',
      },
    },
  },
} satisfies Components<Theme>['MuiFormLabel'];

export const MuiFormHelperText = {
  styleOverrides: {
    root: {
      marginLeft: '2px',
      marginRight: 0,
      marginTop: '4px',
      fontSize: '0.75rem',
      '&.Mui-error': {
        color: 'var(--mui-palette-error-main)',
      },
    },
  },
} satisfies Components<Theme>['MuiFormHelperText'];

export const MuiFormControlLabel = {
  styleOverrides: {
    root: {
      marginLeft: '-11px',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
} satisfies Components<Theme>['MuiFormControlLabel'];

export const MuiInputLabel = {
  styleOverrides: {
    root: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'var(--mui-palette-text-secondary)',
      '&.Mui-focused': {
        color: 'var(--mui-palette-primary-main)',
      },
    },
    outlined: {
      transform: 'translate(14px, 13px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  },
} satisfies Components<Theme>['MuiInputLabel']; 