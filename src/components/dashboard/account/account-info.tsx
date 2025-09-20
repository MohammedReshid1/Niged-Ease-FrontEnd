'use client';

import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserInfo } from '@/hooks/use-auth';
import { authApi } from '@/services/api/auth';

interface AccountInfoProps {
  user: UserInfo | null;
  onProfileUpdate?: () => Promise<void>;
}

export function AccountInfo({ user, onProfileUpdate }: AccountInfoProps): React.JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Loading...';
  const email = user?.email || '';
  const role = user?.role || '';
  
  // Format role for display
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'stock_manager': return 'Stock Manager';
      case 'sales': return 'Sales';
      default: return role;
    }
  };
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setImageUrl('');
    setUrlError('');
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    
    // Clear error when field is edited
    if (urlError) {
      setUrlError('');
    }
  };
  
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('Image URL is required');
      return false;
    }
    
    if (url.length > 255) {
      setUrlError('URL must be less than 255 characters');
      return false;
    }
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };
  
  const handleUpload = async () => {
    if (!validateUrl(imageUrl)) {
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      setUploadError(null);
      
      await authApi.updateProfileImage(imageUrl);
      
      // Refresh user data to get updated profile image
      if (onProfileUpdate) {
        await onProfileUpdate();
      }
      
      setUploadSuccess(true);
      setDialogOpen(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile image:', error);
      
      // Display more specific error messages
      let errorMessage = 'Failed to update profile image. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          errorMessage = 'Update endpoint not found. Please contact support.';
        } else if (error.response.status === 400) {
          if (error.response.data && typeof error.response.data === 'object') {
            // Format validation errors
            const validationErrors = Object.entries(error.response.data)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join('; ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else {
            errorMessage = 'Invalid data. Please check your input.';
          }
        } else if (error.response.data && error.response.data.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something happened in setting up the request that triggered an error
        errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCloseError = () => {
    setUploadError(null);
  };

  return (
    <>
      <Card>
        <CardHeader title="Profile Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={user?.profile_image} 
                  sx={{ height: '80px', width: '80px', mb: 1 }}
                >
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </Avatar>
                
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleOpenDialog}
                    disabled={isUploading}
                  >
                    Update Profile Photo
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {displayName}
              </Typography>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {email}
              </Typography>
              <Typography color="primary" variant="body2" sx={{ mb: 1 }}>
                {getRoleDisplay(role)}
              </Typography>
              
              {uploadSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Profile image updated successfully!
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
        
        <Snackbar open={!!uploadError} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error">
            {uploadError}
          </Alert>
        </Snackbar>
      </Card>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a URL for your profile picture. The image should be publicly accessible.
          </DialogContentText>
          <TextField
            autoFocus
            label="Image URL"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={handleUrlChange}
            error={!!urlError}
            helperText={urlError || "Example: https://example.com/your-image.jpg"}
            placeholder="https://example.com/your-image.jpg"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpload}
            variant="contained"
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : null}
          >
            {isUploading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
