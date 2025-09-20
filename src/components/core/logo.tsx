'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  return (
    <Box 
      alt="logo" 
      component="img" 
      height={height} 
      src="/assets/Neged.png" 
      width="auto"
      sx={{ 
        objectFit: 'contain',
        display: 'block',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '100%',
        border: '1px solid rgba(203, 213, 225, 0.3)',
      }}
    />
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo height={height} width={width} {...props} />
    </NoSsr>
  );
}
