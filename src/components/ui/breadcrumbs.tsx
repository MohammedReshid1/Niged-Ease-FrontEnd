import React from 'react';
import Link from 'next/link';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { Link as MuiLink } from '@mui/material';

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps): React.JSX.Element => {
  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast) {
          return (
            <Typography 
              key={index} 
              color="text.secondary" 
              variant="body2"
            >
              {item.label}
            </Typography>
          );
        }
        
        return (
          <MuiLink
            key={index}
            component={Link}
            href={item.href || '#'}
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            {item.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
}; 