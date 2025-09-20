'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/providers/auth-provider';
import { authApi } from '@/services/api/auth';
import { paths } from '@/paths';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { ShieldStar as ShieldStarIcon } from '@phosphor-icons/react/dist/ssr/ShieldStar';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useRouter } from 'next/navigation';
import { SimpleUpload } from '@/components/common/simple-upload';

export default function ProfilePage() {
  const { userInfo, refreshUserInfo } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const isSuperAdmin = userInfo?.role === 'super_admin';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profile = await authApi.getProfile();
        setProfileData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          profile_image: profile.profile_image || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        enqueueSnackbar('Failed to load profile data', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [enqueueSnackbar]);

  const validateForm = () => {
    const newErrors = {
      first_name: '',
      last_name: '',
      email: '',
      profile_image: '',
    };
    
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Additional validations
    if (profileData.first_name && profileData.first_name.length > 50) {
      newErrors.first_name = 'First name must be 50 characters or less';
    }

    if (profileData.last_name && profileData.last_name.length > 50) {
      newErrors.last_name = 'Last name must be 50 characters or less';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setUpdateSuccess(false);
    
    try {
      const updatedProfile = await authApi.updateProfile({
        first_name: profileData.first_name?.trim(),
        last_name: profileData.last_name?.trim(),
        email: profileData.email.trim(),
        profile_image: profileData.profile_image?.trim() || undefined
      });
      
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      setUpdateSuccess(true);
      
      // Refresh user info in context instead of reloading the page
      await refreshUserInfo();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to update profile';
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {
      old_password: '',
      new_password: '',
      confirm_password: '',
    };
    
    if (!passwordData.old_password) {
      newErrors.old_password = 'Current password is required';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (passwordData.confirm_password !== passwordData.new_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: '',
      });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);
    setPasswordUpdateSuccess(false);
    
    try {
      // First try to verify the old password
      try {
        // We can attempt to login with the old password to verify it's correct
        await authApi.login(profileData.email, passwordData.old_password);
      } catch (error: any) {
        // If login fails, the old password is incorrect
        if (error?.response?.status === 401) {
          enqueueSnackbar('Current password is incorrect', { variant: 'error' });
          setIsChangingPassword(false);
          return;
        }
        // If there's another error, proceed with the password change anyway
        console.warn('Could not verify old password, proceeding with change:', error);
      }
      
      // Proceed with password change
      await authApi.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      
      enqueueSnackbar('Password updated successfully', { variant: 'success' });
      setPasswordUpdateSuccess(true);
      
      // Reset password fields
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to update password';
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Format role display
  const formatRoleDisplay = (role: string | null | undefined) => {
    if (!role) return '';
    return role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const handleBack = () => {
    router.push(paths.superAdmin.dashboard);
  };

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowLeftIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4">
            Super Admin Profile
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account settings and profile information
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <Typography>Loading profile information...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={profileData.profile_image}
                    sx={{
                      height: 100,
                      width: 100,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: 3,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {!profileData.profile_image && (
                      <ShieldStarIcon weight="bold" fontSize="3.5rem" />
                    )}
                  </Avatar>
                  <Typography variant="h6">
                    {profileData.first_name} {profileData.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.email}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {formatRoleDisplay(userInfo?.role)}
                  </Typography>
                  
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                    <Typography variant="body2" color="primary.main">
                      System Administrator with full access to all features
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card component="form" onSubmit={handleSubmit}>
                <CardHeader 
                  title="Edit Profile" 
                  subheader="Update your super admin account details"
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  {updateSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Your profile has been updated successfully.
                    </Alert>
                  )}
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                      <SimpleUpload
                        initialImage={profileData.profile_image}
                        onImageChange={(url) => {
                          // Just update local state, don't save to backend yet
                          setProfileData(prev => ({
                            ...prev,
                            profile_image: url || ''
                          }));
                        }}
                        bucketName="app-images"
                        folderPath="profiles"
                        label="Upload Profile Picture"
                        width={180}
                        height={180}
                        allowRemove={true}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <LoadingButton
                    color="primary"
                    loading={isSaving}
                    type="submit"
                    variant="contained"
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </Card>

              <Card component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 3 }}>
                <CardHeader 
                  title="Change Password" 
                  subheader="Update your login credentials"
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  {passwordUpdateSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Your password has been updated successfully.
                    </Alert>
                  )}
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="old_password"
                        type="password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        required
                        error={!!passwordErrors.old_password}
                        helperText={passwordErrors.old_password}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        required
                        error={!!passwordErrors.new_password}
                        helperText={passwordErrors.new_password}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirm_password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        required
                        error={!!passwordErrors.confirm_password}
                        helperText={passwordErrors.confirm_password}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <LoadingButton
                    color="primary"
                    loading={isChangingPassword}
                    type="submit"
                    variant="contained"
                  >
                    Update Password
                  </LoadingButton>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
} 