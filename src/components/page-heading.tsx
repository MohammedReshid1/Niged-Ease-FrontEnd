import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeading = ({ title, subtitle, actions }: PageHeadingProps): React.JSX.Element => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
    <Box>
      <Typography variant="h4">{title}</Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions}
  </Stack>
); 