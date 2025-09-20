import React from 'react';
import { Alert, AlertTitle, IconButton, Box, Typography, Button } from '@mui/material';
import { ArrowsCounterClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsCounterClockwise';
import { WarningCircle as WarningCircleIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';

import { extractErrorMessage } from '@/utils/api-error';

interface ErrorMessageProps {
  error?: any;
  message?: string;
  title?: string;
  onRetry?: () => void;
  showRefreshButton?: boolean;
  fullPage?: boolean;
  showDetails?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  message,
  title = 'Error',
  onRetry,
  showRefreshButton = true,
  fullPage = false,
  showDetails = false,
}) => {
  // Use provided message or extract from error object
  const errorMessage = message || (error ? extractErrorMessage(error) : 'An error occurred');
  const statusCode = error?.response?.status;
  
  if (fullPage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={fullPage ? '50vh' : 'auto'}
        p={3}
        textAlign="center"
      >
        <WarningCircleIcon size={50} weight="fill" color="#d32f2f" style={{ marginBottom: '1rem' }} />
        
        <Typography variant="h5" color="error" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {errorMessage}
        </Typography>
        
        {statusCode && (
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Status Code: {statusCode}
          </Typography>
        )}
        
        {showDetails && error?.stack && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxWidth: '100%', overflow: 'auto' }}>
            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {error.stack}
            </Typography>
          </Box>
        )}
        
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        )}
      </Box>
    );
  }
  
  return (
    <Alert 
      severity="error"
      action={
        showRefreshButton && onRetry ? (
          <IconButton
            color="inherit"
            size="small"
            onClick={onRetry}
            aria-label="retry"
          >
            <RefreshIcon />
          </IconButton>
        ) : null
      }
      sx={{ mb: 2 }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {errorMessage}
      
      {showDetails && statusCode && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Status Code: {statusCode}
        </Typography>
      )}
    </Alert>
  );
};

export default ErrorMessage; 