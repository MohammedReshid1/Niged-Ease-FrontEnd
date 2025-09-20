'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import FormHelperText from '@mui/material/FormHelperText';

import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { paths } from '@/paths';
import { usersApi, ExtendedUserResponse } from '@/services/api/users';
import { authApi, UserResponse, CreateUserData } from '@/services/api/auth';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore } from '@/providers/store-provider';
import { useCheckCompanySubscription } from '@/hooks/use-companies';
import { useTranslation } from 'react-i18next';

// User type definition for form data
type UserRole = 'super_admin' | 'admin' | 'sales' | 'stock_manager' | string;
type UserFormData = Omit<CreateUserData, 'role'> & { 
  id?: string;
  role: UserRole;
  assigned_store_id?: string;
};

// User form dialog component
function UserFormDialog({ 
  open, 
  onClose, 
  user, 
  companyId, 
  onSave 
}: { 
  open: boolean; 
  onClose: () => void; 
  user: Partial<CreateUserData & { id?: string; role?: string, assigned_store_id?: string }> | null; 
  companyId: string; 
  onSave: (userData: UserFormData) => Promise<void>; 
}) {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = React.useState<UserFormData & { assigned_store_id?: string }>({
    company_id: companyId,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'stock_manager',
    profile_image: '',
    assigned_store_id: ''
  });
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { enqueueSnackbar } = useSnackbar();
  const { stores } = useStore();

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        company_id: user.company_id || companyId,
        email: user.email || '',
        password: user.id ? '' : (user.password || ''), // Don't require password for edits
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: (user.role as UserRole) || 'stock_manager',
        profile_image: user.profile_image || '',
        assigned_store_id: user.assigned_store_id || ''
      });
    } else {
      setFormData({
        company_id: companyId,
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'stock_manager',
        profile_image: '',
        assigned_store_id: stores.length > 0 ? stores[0].id : ''
      });
    }
    setErrors({});
  }, [user, companyId, stores]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = t('users.email_invalid');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('users.email_invalid');
    }
    
    if (!formData.id && !formData.password) {
      newErrors.password = t('users.password_requirements');
    } else if (!formData.id && formData.password && formData.password.length < 8) {
      newErrors.password = t('users.password_requirements');
    }
    
    if (!formData.first_name) {
      newErrors.first_name = `${t('users.first_name')} ${t('common.is_required')}`;
    }
    
    if (!formData.last_name) {
      newErrors.last_name = `${t('users.last_name')} ${t('common.is_required')}`;
    }

    // Validate assigned store for stock manager and sales
    if ((formData.role === 'stock_manager' || formData.role === 'sales') && !formData.assigned_store_id) {
      newErrors.assigned_store_id = t('users.assigned_store_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, role: e.target.value as UserRole }));
  };

  const handleStoreChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, assigned_store_id: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      enqueueSnackbar(t('users.error_saving'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Check if role requires an assigned store
  const requiresAssignedStore = formData.role === 'stock_manager' || formData.role === 'sales';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user?.id ? t('users.edit_user') : t('users.add_user')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar 
              src={formData.profile_image || undefined} 
              alt={`${formData.first_name} ${formData.last_name}`}
              sx={{ 
                width: 100, 
                height: 100,
                border: '2px solid var(--mui-palette-primary-main)'
              }}
            >
              {formData.first_name?.[0]}{formData.last_name?.[0]}
            </Avatar>
          </Box>
          
          <TextField
            label={t('users.user_email')}
            name="email"
            value={formData.email}
            onChange={handleTextChange}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            label={t('users.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleTextChange}
            fullWidth
            required={!user?.id}
            error={!!errors.password}
            helperText={errors.password || (user?.id ? t('users.password_leave_blank') : '')}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('users.first_name')}
                name="first_name"
                value={formData.first_name}
                onChange={handleTextChange}
                fullWidth
                required
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('users.last_name')}
                name="last_name"
                value={formData.last_name}
                onChange={handleTextChange}
                fullWidth
                required
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>
          </Grid>
          
          <FormControl fullWidth>
            <InputLabel id="role-label">{t('common.role')}</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={formData.role}
              onChange={handleRoleChange}
              label={t('common.role')}
            >
              <MenuItem value="admin">{t('users.admin')}</MenuItem>
              <MenuItem value="sales">{t('users.salesman')}</MenuItem>
              <MenuItem value="stock_manager">{t('common.stock_manager')}</MenuItem>
            </Select>
          </FormControl>
          
          {/* Store selector - only visible for stock manager and sales */}
          {requiresAssignedStore && (
            <FormControl fullWidth error={!!errors.assigned_store_id}>
              <InputLabel id="store-label">{t('common.store')}</InputLabel>
              <Select
                labelId="store-label"
                id="assigned_store_id"
                value={formData.assigned_store_id}
                onChange={handleStoreChange}
                label={t('common.store')}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.assigned_store_id && (
                <FormHelperText>{errors.assigned_store_id}</FormHelperText>
              )}
            </FormControl>
          )}
          
          <TextField
            label={t('users.profile_image')}
            name="profile_image"
            value={formData.profile_image}
            onChange={handleTextChange}
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={saving}
        >
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Delete confirmation dialog
function DeleteUserDialog({ 
  open, 
  onClose, 
  userId, 
  onDelete 
}: { 
  open: boolean; 
  onClose: () => void; 
  userId: string | null;
  onDelete: () => Promise<void>; 
}) {
  const { t } = useTranslation('admin');
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('users.delete_user')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('users.confirm_delete')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          disabled={deleting}
        >
          {deleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const { t } = useTranslation('admin');
  const [users, setUsers] = React.useState<ExtendedUserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<ExtendedUserResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [storeFilter, setStoreFilter] = React.useState<string>('all');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [userFormOpen, setUserFormOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<(Partial<CreateUserData> & { 
    id?: string; 
    role?: string;
    assigned_store_id?: string;
  }) | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  const { stores } = useStore();
  
  // Get subscription details
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useCheckCompanySubscription(userInfo?.company_id);
  
  // Fetch users data
  const fetchUsers = useCallback(async () => {
    if (!userInfo) {
      // Don't show error message on initial load
      // User info might not be ready yet
      setIsLoading(true);
      return;
    }

    if (!userInfo.company_id) {
      // Only show error if we have userInfo but no company_id
      enqueueSnackbar(t('common.no_company_error'), { variant: 'error' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching users for company:', userInfo.company_id);
      
      // Use the company_id parameter to get users filtered by company on the backend
      const allUsers = await usersApi.getUsers(userInfo.company_id);
      console.log('Users retrieved:', allUsers.length);
      
      // Additional filter for stock_manager and sales roles on the client side
      const filteredByRole = allUsers.filter(user => 
        user.role === 'stock_manager' || user.role === 'sales'
      );
      console.log('Users after role filtering:', filteredByRole.length);
      
      // Fetch user details including assigned store for each user
      const usersWithDetails = await Promise.all(filteredByRole.map(async (user) => {
        try {
          // Try to get more detailed user info including assigned store
          const userDetail = await usersApi.getUser(user.id);
          console.log(`User ${user.id} details:`, {
            email: userDetail.email,
            role: userDetail.role,
            assigned_store: userDetail.assigned_store
          });
          
          // If the user has no assigned_store but should have one, check if there's a raw property
          const assignedStore = userDetail.assigned_store || 
                               (userDetail as any).assigned_store_id ? 
                               { id: (userDetail as any).assigned_store_id, name: 'Unknown Store' } : 
                               null;
          
          return {
            ...user,
            assigned_store: assignedStore
          };
        } catch (error) {
          console.error(`Error fetching details for user ${user.id}:`, error);
          return {
            ...user,
            assigned_store: null
          };
        }
      }));
      
      console.log('Users with details:', usersWithDetails.map(user => ({
        id: user.id,
        email: user.email,
        assigned_store: user.assigned_store
      })));
      
      setUsers(usersWithDetails);
      
      // The filter effect will run after this to update filteredUsers
    } catch (error) {
      console.error('Error fetching users:', error);
      enqueueSnackbar(t('users.loading_error'), { variant: 'error' });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, enqueueSnackbar, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Filter users based on search query, role filter, and store filter
  const filterUsers = useCallback((userList: ExtendedUserResponse[], query: string, role: string, store: string) => {
    let filtered = [...userList];
    
    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply role filter
    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Apply store filter
    if (store !== 'all') {
      console.log(`Filtering by store ID: ${store}`);
      console.log('User store assignments:', userList.map(user => ({
        userId: user.id,
        userName: `${user.first_name} ${user.last_name}`,
        storeInfo: user.assigned_store
      })));
      
      filtered = filtered.filter(user => {
        const match = user.assigned_store && user.assigned_store.id === store;
        console.log(`User ${user.id} (${user.email}) - has store: ${!!user.assigned_store}, store id: ${user.assigned_store?.id}, match: ${match}`);
        return match;
      });
    }
    
    console.log(`Filter results: ${filtered.length} users matched from ${userList.length} total`);
    setFilteredUsers(filtered);
  }, []);
  
  useEffect(() => {
    filterUsers(users, searchQuery, roleFilter, storeFilter);
    // Add debug logging to help troubleshoot the filter functionality
    console.log('Filter applied:', {
      totalUsers: users.length,
      filteredUsersCount: filteredUsers.length,
      searchQuery,
      roleFilter,
      storeFilter
    });
  }, [users, searchQuery, roleFilter, storeFilter, filterUsers]);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const handleStoreFilterChange = (event: SelectChangeEvent) => {
    setStoreFilter(event.target.value);
  };
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleSelectOne = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };
  
  const handleAddUser = () => {
    // Check subscription limits for users
    if (subscriptionData && !isLoadingSubscription) {
      const { current_users_count, max_customers } = subscriptionData;
      
      if (current_users_count >= max_customers) {
        enqueueSnackbar(t('users.subscription_limit', { max: max_customers }), { 
          variant: 'error', 
          autoHideDuration: 6000 
        });
        return;
      }
    }
    
    setCurrentUser({
      company_id: userInfo?.company_id || '',
    });
    setUserFormOpen(true);
  };
  
  const handleEditUser = (user: ExtendedUserResponse) => {
    // Extract the assigned store ID from user data and convert to the format needed by the form
    const assigned_store_id = user.assigned_store ? user.assigned_store.id : undefined;
    
    // Create a user object compatible with the form, excluding assigned_store object
    const { assigned_store, ...userWithoutAssignedStore } = user;
    
    setCurrentUser({
      ...userWithoutAssignedStore,
      role: user.role as UserRole,
      assigned_store_id
    });
    setUserFormOpen(true);
  };
  
  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveUser = async (userData: UserFormData & { assigned_store_id?: string }) => {
    try {
      // Create a new object without the password if it's empty
      const { password, ...userDataWithoutPassword } = userData;
      
      // Add company_id to the user data
      const userDataWithCompany = {
        ...(password ? { password } : {}),
        ...userDataWithoutPassword,
        company_id: userInfo?.company_id || '',
      };

      // Add assigned_store if role requires it (stock_manager or sales)
      if (userData.role === 'stock_manager' || userData.role === 'sales') {
        if (!userData.assigned_store_id) {
          enqueueSnackbar(t('users.assigned_store_required'), { variant: 'error' });
          throw new Error('Assigned store is required');
        }
        
        // Use assigned_store field instead of assigned_store_id for backend compatibility
        (userDataWithCompany as any).assigned_store = userData.assigned_store_id;
        
        // Remove the assigned_store_id field to prevent confusion
        delete (userDataWithCompany as any).assigned_store_id;
      }

      if (userData.id) {
        const { id, ...updateData } = userDataWithCompany;
        // Create a new object without the password if it's empty
        const dataToUpdate = { ...updateData };
        if (!password) {
          await usersApi.updateUser(id as string, dataToUpdate);
        } else {
          await usersApi.updateUser(id as string, dataToUpdate);
        }
        enqueueSnackbar(t('users.user_updated'), { variant: 'success' });
      } else {
        // Create user
        await authApi.createUser(userDataWithCompany as CreateUserData);
        enqueueSnackbar(t('users.user_created'), { variant: 'success' });
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await usersApi.deleteUser(userToDelete);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'stock_manager': return t('users.stock_manager');
      case 'sales': return t('users.salesman');
      default: return role;
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.admin.dashboard },
    { label: t('users.title'), url: paths.admin.users },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>{t('users.title')}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAddUser}
            startIcon={<PlusIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('users.add_user')}
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <OutlinedInput
              placeholder={t('common.search')}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon />
                </InputAdornment>
              }
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: { xs: '100%', sm: 240 } }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="role-filter-label">{t('common.role')}</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label={t('common.role')}
              >
                <MenuItem value="all">{t('users.all_roles')}</MenuItem>
                <MenuItem value="stock_manager">{t('users.stock_manager')}</MenuItem>
                <MenuItem value="sales">{t('users.salesman')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="store-filter-label">{t('common.store')}</InputLabel>
              <Select
                labelId="store-filter-label"
                value={storeFilter}
                onChange={handleStoreFilterChange}
                label={t('common.store')}
              >
                <MenuItem value="all">{t('common.all_stores')}</MenuItem>
                {stores.map(store => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>

      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('users.user_email')}</TableCell>
                <TableCell>{t('common.role')}</TableCell>
                <TableCell>{t('users.assigned_store')}</TableCell>
                <TableCell>{t('common.created_at')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('users.no_users')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.profile_image || undefined} 
                          alt={`${user.first_name} ${user.last_name}`}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            mr: 2,
                          }}
                        >
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {user.first_name} {user.last_name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleDisplay(user.role)}</TableCell>
                    <TableCell>{user.assigned_store ? user.assigned_store.name : t('common.not_available')}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditUser(user)}>
                        <PencilSimpleIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* User Form Dialog */}
      <UserFormDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        user={currentUser}
        companyId={userInfo?.company_id || ''}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        userId={userToDelete}
        onDelete={handleConfirmDelete}
      />
    </Box>
  );
} 