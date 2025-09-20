import type { Components } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import type { Theme } from '../types';

export const MuiTableHead = {
  styleOverrides: {
    root: {
      '> tr > th:first-of-type': {
        paddingLeft: '24px',
        borderTopLeftRadius: '8px',
      },
      '> tr > th:last-child': {
        paddingRight: '24px',
        borderTopRightRadius: '8px',
      },
      borderBottom: '1px solid var(--mui-palette-divider)',
      backgroundColor: 'var(--mui-palette-background-level1)',
    },
  },
} satisfies Components<Theme>['MuiTableHead'];
