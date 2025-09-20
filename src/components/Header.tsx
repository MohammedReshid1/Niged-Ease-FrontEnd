'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
}

export default function Header({ 
  title, 
  description, 
  actionLabel, 
  actionIcon, 
  onActionClick 
}: HeaderProps): React.JSX.Element {
  const router = useRouter();
  
  return (
    <Box 
      sx={{
        backgroundColor: 'background.paper',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>{title}</Typography>
            {description && (
              <Typography variant="body1" color="text.secondary">{description}</Typography>
            )}
          </Box>
          {actionLabel && onActionClick && (
            <Button
              variant="contained"
              startIcon={actionIcon}
              onClick={onActionClick}
              sx={{ backgroundColor: '#0ea5e9', '&:hover': { backgroundColor: '#0284c7' } }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
} 