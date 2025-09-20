import { PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    accent?: PaletteColorOptions;
  }

  interface Palette {
    accent: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
} 