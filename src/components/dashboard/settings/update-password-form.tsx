'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import FormHelperText from '@mui/material/FormHelperText';
import { useState } from 'react';
import { authApi } from '@/services/api/auth';
import tokenStorage from '@/utils/token-storage';

export function UpdatePasswordForm(): React.JSX.Element {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // First try to verify the old password
      try {
        const userInfo = tokenStorage.getUserInfo();
        if (!userInfo || !userInfo.email) {
          throw new Error('User information not available');
        }
        
        // We can attempt to login with the old password to verify it's correct
        await authApi.login(userInfo.email, formData.current_password);
      } catch (error: any) {
        // If login fails, the old password is incorrect
        if (error?.response?.status === 401) {
          setSaveError('Current password is incorrect. Please try again.');
          setIsSubmitting(false);
          return;
        }
        // If there's another error, proceed with the password change anyway
        console.warn('Could not verify old password, proceeding with change:', error);
      }
      
      // Proceed with password change
      await authApi.changePassword({
        old_password: formData.current_password,
        new_password: formData.new_password
      });
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setSaveError('Failed to update password. Please ensure your current password is correct.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update your password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth error={!!errors.current_password}>
              <InputLabel>Current Password</InputLabel>
              <OutlinedInput 
                label="Current Password" 
                name="current_password" 
                type="password" 
                value={formData.current_password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.current_password && (
                <FormHelperText>{errors.current_password}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.new_password}>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput 
                label="New Password" 
                name="new_password" 
                type="password" 
                value={formData.new_password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.new_password && (
                <FormHelperText>{errors.new_password}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.confirm_password}>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput 
                label="Confirm Password" 
                name="confirm_password" 
                type="password" 
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.confirm_password && (
                <FormHelperText>{errors.confirm_password}</FormHelperText>
              )}
            </FormControl>
            
            <Collapse in={!!saveError}>
              <Alert severity="error">
                {saveError}
              </Alert>
            </Collapse>
            
            <Collapse in={saveSuccess}>
              <Alert severity="success">
                Password updated successfully!
              </Alert>
            </Collapse>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
