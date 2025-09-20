import type { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography = {
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  body1: { 
    fontSize: '1rem', 
    fontWeight: 400, 
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },
  body2: { 
    fontSize: '0.875rem', 
    fontWeight: 400, 
    lineHeight: 1.6,
    letterSpacing: '0.00714em',
  },
  button: { 
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },
  caption: { 
    fontSize: '0.75rem', 
    fontWeight: 400, 
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  subtitle1: { 
    fontSize: '1rem', 
    fontWeight: 500, 
    lineHeight: 1.57,
    letterSpacing: '0.00938em',
  },
  subtitle2: { 
    fontSize: '0.875rem', 
    fontWeight: 500, 
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08333em',
    lineHeight: 2.5,
    textTransform: 'uppercase',
  },
  h1: { 
    fontSize: '3.5rem', 
    fontWeight: 700, 
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: { 
    fontSize: '3rem', 
    fontWeight: 700, 
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
  },
  h3: { 
    fontSize: '2.25rem', 
    fontWeight: 600, 
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h4: { 
    fontSize: '2rem', 
    fontWeight: 600, 
    lineHeight: 1.2,
    letterSpacing: '0.00735em',
  },
  h5: { 
    fontSize: '1.5rem', 
    fontWeight: 600, 
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h6: { 
    fontSize: '1.125rem', 
    fontWeight: 600, 
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
} satisfies TypographyOptions;
