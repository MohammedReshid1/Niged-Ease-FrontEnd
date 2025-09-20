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
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { UserInfo } from '@/hooks/use-auth';
import { useState } from 'react';
import { authApi } from '@/services/api/auth';

interface AccountDetailsFormProps {
  userInfo: UserInfo | null;
}

export function AccountDetailsForm({ userInfo }: AccountDetailsFormProps): React.JSX.Element {
  const [formData, setFormData] = useState({
    first_name: userInfo?.first_name || '',
    last_name: userInfo?.last_name || '',
    email: userInfo?.email || '',
    phone: '',
    city: '',
    country: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Update form when userInfo changes
  React.useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        email: userInfo.email || ''
      }));
    }
  }, [userInfo]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userInfo) return;
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      await authApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to update profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update your profile information" title="Profile Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput 
                  value={formData.first_name} 
                  onChange={handleChange}
                  label="First name" 
                  name="first_name" 
                  disabled={isSubmitting}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput 
                  value={formData.last_name} 
                  onChange={handleChange}
                  label="Last name" 
                  name="last_name" 
                  disabled={isSubmitting}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput 
                  value={formData.email} 
                  onChange={handleChange}
                  label="Email address" 
                  name="email" 
                  disabled={true} // Email cannot be changed
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput 
                  label="Phone number" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </Grid>
            
            <Grid xs={12}>
              <Collapse in={!!saveError}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {saveError}
                </Alert>
              </Collapse>
              
              <Collapse in={saveSuccess}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile updated successfully!
                </Alert>
              </Collapse>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : 'Save Details'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
