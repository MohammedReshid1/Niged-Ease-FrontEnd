'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useRouter } from 'next/navigation';
import { FormControl, InputLabel, Select, SelectChangeEvent, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, Tooltip } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { PencilSimple as PencilIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { useUpdateCompany, useCompany, useCurrencies, useSubscriptionPlans } from '@/hooks/use-companies';
import { paths } from '@/paths';
import ErrorMessage from '@/components/common/error-message';
import { usersApi, ExtendedUserResponse } from '@/services/api/users';
import { authApi, CreateUserData } from '@/services/api/auth';
import { useSnackbar } from 'notistack';
import { ImageUpload } from '@/components/common/image-upload';

export default function CompanyEditPage({ params }: { params: { id: string } }): React.JSX.Element {
  const router = useRouter();
  const { id } = params;
  const { data: company, isLoading: isLoadingCompany } = useCompany(id);
  const updateCompanyMutation = useUpdateCompany();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useSubscriptionPlans();
  const { enqueueSnackbar } = useSnackbar();
  
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    is_active: true,
    subscription_plan: ''
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  // State for company admins
  const [companyAdmins, setCompanyAdmins] = React.useState<ExtendedUserResponse[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = React.useState(false);
  const [openAddAdminDialog, setOpenAddAdminDialog] = React.useState(false);
  const [adminFormData, setAdminFormData] = React.useState<Partial<CreateUserData>>({
    role: 'admin',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  });
  const [adminFormErrors, setAdminFormErrors] = React.useState<Record<string, string>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  const [deletingUser, setDeletingUser] = React.useState(false);
  const [creatingAdmin, setCreatingAdmin] = React.useState(false);

  // Set initial form data when company data loads
  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description || '',
        is_active: company.is_active,
        subscription_plan: company.subscription_plan || ''
      });

      // Load company admins
      loadCompanyAdmins(id);
    }
  }, [company]);

  // Load company administrators
  const loadCompanyAdmins = async (companyId: string) => {
    setIsLoadingAdmins(true);
    try {
      const users = await usersApi.getUsers(companyId);
      // Filter for admins only and ensure they belong to this company
      const adminUsers = users.filter(user => 
        user.role === 'admin' && 
        user.company_id === companyId
      );
      setCompanyAdmins(adminUsers);
    } catch (error) {
      console.error('Error fetching company admins:', error);
      enqueueSnackbar('Failed to load company administrators', { variant: 'error' });
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<boolean>
  ) => {
    const { name, value } = e.target;
    if (name) {
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
    }
  };

  const handleAdminFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setAdminFormData({
        ...adminFormData,
        [name]: value
      });
      
      // Clear error when field is edited
      if (adminFormErrors[name as string]) {
        setAdminFormErrors({
          ...adminFormErrors,
          [name as string]: ''
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.subscription_plan) {
      errors.subscription_plan = 'Subscription plan is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAdminForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!adminFormData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!adminFormData.password?.trim()) {
      errors.password = 'Password is required';
    } else if (adminFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!adminFormData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!adminFormData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    setAdminFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await updateCompanyMutation.mutateAsync({ id, data: formData });
      setOpenSnackbar(true);
      
      // Navigate back to companies list after successful update
      setTimeout(() => {
        router.push(paths.superAdmin.companies);
      }, 1500);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenAddAdminDialog = () => {
    setAdminFormData({
      role: 'admin',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      profile_image: '',
    });
    setAdminFormErrors({});
    setOpenAddAdminDialog(true);
  };

  const handleCloseAddAdminDialog = () => {
    setOpenAddAdminDialog(false);
  };

  const handleAddAdmin = async () => {
    if (!validateAdminForm()) {
      return;
    }

    setCreatingAdmin(true);
    try {
      await authApi.createUser({
        ...adminFormData as CreateUserData,
        company_id: id,
        role: 'admin',
      });
      
      enqueueSnackbar('Admin user added successfully', { variant: 'success' });
      handleCloseAddAdminDialog();
      loadCompanyAdmins(id);
    } catch (error) {
      console.error('Error creating admin user:', error);
      enqueueSnackbar('Failed to create admin user', { variant: 'error' });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeletingUser(true);
    try {
      await usersApi.deleteUser(userToDelete);
      setCompanyAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== userToDelete));
      enqueueSnackbar('Admin user deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar('Failed to delete admin user', { variant: 'error' });
    } finally {
      setDeletingUser(false);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const isLoading = isLoadingCompany || isLoadingCurrencies || isLoadingSubscriptionPlans || updateCompanyMutation.isPending;

  // Show loading state while company data is being fetched
  if (isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error if company is not found
  if (!company && !isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <ErrorMessage 
          error={new Error('Company not found')}
          title="Failed to load company"
          onRetry={() => router.refresh()}
          fullPage
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => router.push(paths.superAdmin.companies)}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowLeftIcon />}
              onClick={() => router.push(paths.superAdmin.companies)}
            >
              Back to Companies
            </Button>
            <Typography variant="h4">Edit Company: {company?.name}</Typography>
          </Stack>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Company Information" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="name"
                      onChange={handleChange}
                      required
                      value={formData.name}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      onChange={handleChange}
                      required
                      value={formData.description}
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Subscription Plan"
                      name="subscription_plan"
                      onChange={handleChange}
                      required
                      select
                      value={formData.subscription_plan}
                      error={!!formErrors.subscription_plan}
                      helperText={formErrors.subscription_plan || 'Select a subscription plan'}
                      disabled={isLoading || isLoadingSubscriptionPlans}
                    >
                      {isLoadingSubscriptionPlans ? (
                        <MenuItem disabled>Loading subscription plans...</MenuItem>
                      ) : (
                        subscriptionPlans?.map((plan) => (
                          <MenuItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.billing_cycle} ({plan.price})
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="is_active"
                        value={formData.is_active ? "true" : "false"}
                        label="Status"
                        onChange={(e) => {
                          const value = e.target.value === "true";
                          setFormData({
                            ...formData,
                            is_active: value
                          });
                        }}
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                  
                  {updateCompanyMutation.isError && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        Error updating company: {(updateCompanyMutation.error as Error).message}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </form>

          {/* Company Administrators Section */}
          <Card>
            <CardHeader 
              title="Company Administrators" 
              action={
                <Button
                  color="primary"
                  size="small"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenAddAdminDialog}
                  variant="contained"
                >
                  Add Admin
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {isLoadingAdmins ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : companyAdmins.length === 0 ? (
                <Alert severity="info">No administrators found for this company</Alert>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          {admin.first_name} {admin.last_name}
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          {new Date(admin.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Delete admin">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              size="small"
                            >
                              <TrashIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Company updated successfully!
        </Alert>
      </Snackbar>

      {/* Add Admin Dialog */}
      <Dialog open={openAddAdminDialog} onClose={handleCloseAddAdminDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Company Administrator</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ImageUpload
                  initialImage={adminFormData.profile_image}
                  onImageChange={(url) => {
                    setAdminFormData({
                      ...adminFormData,
                      profile_image: url || ''
                    });
                  }}
                  bucket="app-images"
                  folder={`company-${id}`}
                  label="Upload Profile Picture"
                  width={120}
                  height={120}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  onChange={handleAdminFormChange}
                  required
                  value={adminFormData.first_name || ''}
                  error={!!adminFormErrors.first_name}
                  helperText={adminFormErrors.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  onChange={handleAdminFormChange}
                  required
                  value={adminFormData.last_name || ''}
                  error={!!adminFormErrors.last_name}
                  helperText={adminFormErrors.last_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleAdminFormChange}
                  required
                  value={adminFormData.email || ''}
                  error={!!adminFormErrors.email}
                  helperText={adminFormErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleAdminFormChange}
                  required
                  value={adminFormData.password || ''}
                  error={!!adminFormErrors.password}
                  helperText={adminFormErrors.password}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAdminDialog}>Cancel</Button>
          <Button 
            onClick={handleAddAdmin} 
            variant="contained" 
            color="primary"
            disabled={creatingAdmin}
            startIcon={creatingAdmin ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {creatingAdmin ? 'Adding...' : 'Add Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this administrator? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteUser} 
            color="error" 
            variant="contained"
            disabled={deletingUser}
            startIcon={deletingUser ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {deletingUser ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 