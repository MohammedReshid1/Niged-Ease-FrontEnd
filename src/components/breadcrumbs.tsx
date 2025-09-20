import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps): React.JSX.Element {
  return (
    <MuiBreadcrumbs separator="›" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return isLast ? (
          <Typography key={item.url} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link 
            key={item.url} 
            component={NextLink} 
            href={item.url}
            color="inherit"
            underline="hover"
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
} 