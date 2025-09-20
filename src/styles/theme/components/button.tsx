import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: { 
      borderRadius: '12px', 
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.2s ease-in-out',
      boxShadow: 'none',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.12)',
      },
      '&:active': {
        transform: 'translateY(0)',
      }
    },
    contained: {
      '&:hover': {
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
      }
    },
    outlined: {
      borderWidth: '1.5px',
      '&:hover': {
        borderWidth: '1.5px',
        backgroundColor: 'rgba(6, 148, 162, 0.04)'
      }
    },
    sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem' },
    sizeMedium: { padding: '10px 20px' },
    sizeLarge: { padding: '12px 24px', fontSize: '1rem' },
    textSizeSmall: { padding: '6px 10px' },
    textSizeMedium: { padding: '8px 14px' },
    textSizeLarge: { padding: '10px 16px' },
    containedPrimary: {
      background: 'linear-gradient(90deg, #0694A2 0%, #047481 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #16BDCA 0%, #0694A2 100%)',
        boxShadow: '0 8px 20px rgba(6, 148, 162, 0.4)'
      }
    },
    containedSecondary: {
      background: 'linear-gradient(90deg, #8B5CF6 0%, #6D28D9 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #A78BFA 0%, #8B5CF6 100%)',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
      }
    },
    containedError: {
      background: 'linear-gradient(90deg, #F43F5E 0%, #E11D48 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #E11D48 0%, #BE123C 100%)',
        boxShadow: '0 8px 20px rgba(244, 63, 94, 0.4)'
      }
    },
    containedSuccess: {
      background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
      }
    },
    containedInfo: {
      background: 'linear-gradient(90deg, #06B6D4 0%, #0891B2 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #0891B2 0%, #0E7490 100%)',
        boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
      }
    },
    containedWarning: {
      background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
      '&:hover': {
        background: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)',
        boxShadow: '0 8px 20px rgba(251, 156, 12, 0.4)'
      }
    },
  },
} satisfies Components<Theme>['MuiButton'];
