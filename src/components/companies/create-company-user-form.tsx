'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import { useCreateUser } from '@/hooks/use-users';

interface CreateCompanyUserFormProps {
  companyId: string;
  onSuccess?: () => void;
}

export const CreateCompanyUserForm: React.FC<CreateCompanyUserFormProps> = ({ companyId, onSuccess }) => {
  const createUserMutation = useCreateUser();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role: 'admin' as const,
    profile_image: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createUserMutation.mutateAsync({
        ...formData,
        company_id: companyId,
        profile_image: formData.profile_image
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Create Admin User" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar 
                src={formData.profile_image || undefined} 
                alt={`${formData.first_name} ${formData.last_name}`}
                sx={{ 
                  width: 100, 
                  height: 100,
                  border: '2px solid var(--mui-palette-primary-main)'
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                onChange={handleChange}
                required
                value={formData.first_name}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                onChange={handleChange}
                required
                value={formData.last_name}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                required
                value={formData.email}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                required
                value={formData.phone}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                required
                value={formData.password}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                type="password"
                onChange={handleChange}
                required
                value={formData.confirm_password}
                error={!!formErrors.confirm_password}
                helperText={formErrors.confirm_password}
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                name="profile_image"
                onChange={handleChange}
                value={formData.profile_image}
                placeholder="https://example.com/profile.jpg"
                helperText="Enter a URL for the user's profile picture"
                disabled={createUserMutation.isPending}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={createUserMutation.isPending}
                  startIcon={createUserMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create Admin User'}
                </Button>
                
                {createUserMutation.isSuccess && (
                  <Alert severity="success" sx={{ flex: 1 }}>
                    Admin user created successfully!
                  </Alert>
                )}
              </Box>
            </Grid>
            
            {createUserMutation.isError && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Error creating user: {(createUserMutation.error as any)?.error || 'An error occurred'}
                </Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}; 