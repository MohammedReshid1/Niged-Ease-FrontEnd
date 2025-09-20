'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  Grid,
  TablePagination
} from '@mui/material';
import { PencilSimple, Plus, Trash, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { 
  useSubscriptionPlans, 
  useCreateSubscriptionPlan, 
  useUpdateSubscriptionPlan, 
  useDeleteSubscriptionPlan,
  usePatchSubscriptionPlan,
  SubscriptionPlanData
} from '@/hooks/use-companies';

const subscriptionPlanSchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, 'Plan name is required').max(100, 'Plan name must be 100 characters or less'),
  description: zod.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  price: zod.string().min(1, 'Price is required').refine(val => !isNaN(Number(val)), { message: 'Price must be a valid number' }),
  billing_cycle: zod.enum(['monthly', 'yearly'], { required_error: 'Billing cycle is required' }),
  is_active: zod.boolean(),
  duration_in_months: zod.number().min(1, 'Duration must be at least 1 month'),
  max_products: zod.number().min(1, 'Max products must be at least 1'),
  max_stores: zod.number().min(1, 'Max stores must be at least 1'),
  max_customers: zod.number().min(1, 'Max customers must be at least 1')
});

type SubscriptionPlanFormValues = zod.infer<typeof subscriptionPlanSchema>;

export default function SubscriptionPlansPage(): React.JSX.Element {
  const { t } = useTranslation('superAdmin');
  const { data: subscriptionPlans, isLoading: isLoadingPlans, error: plansError } = useSubscriptionPlans();
  const createPlanMutation = useCreateSubscriptionPlan();
  const updatePlanMutation = useUpdateSubscriptionPlan();
  const deletePlanMutation = useDeleteSubscriptionPlan();
  const patchPlanMutation = usePatchSubscriptionPlan();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const defaultValues: SubscriptionPlanFormValues = {
    name: '',
    description: '',
    price: '',
    billing_cycle: 'monthly',
    is_active: true,
    duration_in_months: 1,
    max_products: 100,
    max_stores: 5,
    max_customers: 10
  };
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues
  });
  
  const isLoading = isLoadingPlans || 
    createPlanMutation.isPending || 
    updatePlanMutation.isPending || 
    deletePlanMutation.isPending ||
    patchPlanMutation.isPending;
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter subscription plans based on search query
  const filteredPlans = React.useMemo(() => {
    if (!subscriptionPlans) return [];
    
    if (!searchQuery) return subscriptionPlans;
    
    const query = searchQuery.toLowerCase();
    return subscriptionPlans.filter(plan => 
      plan.name.toLowerCase().includes(query) || 
      plan.description.toLowerCase().includes(query) ||
      String(plan.price).includes(query)
    );
  }, [subscriptionPlans, searchQuery]);

  // Calculate pagination
  const paginatedPlans = filteredPlans
    ? filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleCreateDialogOpen = () => {
    reset(defaultValues);
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (plan: any) => {
    setValue('id', plan.id);
    setValue('name', plan.name);
    setValue('description', plan.description);
    setValue('price', plan.price);
    setValue('billing_cycle', plan.billing_cycle);
    setValue('is_active', plan.is_active);
    setValue('duration_in_months', plan.duration_in_months || 1);
    setValue('max_products', plan.max_products || 100);
    setValue('max_stores', plan.max_stores || 5);
    setValue('max_customers', plan.max_customers || 10);
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (plan: any) => {
    setValue('id', plan.id);
    setValue('name', plan.name);
    setDeleteDialogOpen(true);
  };
  
  const handleViewDetails = (plan: any) => {
    setSelectedPlan(plan);
    setDetailsDialogOpen(true);
  };
  
  const handleCreateSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      const { id, ...planData } = data;
      
      // Format the data to match API expectations - ensure all numeric fields are numbers
      const formattedData = {
        ...planData,
        // Ensure numeric fields are sent as proper data types
        price: String(planData.price),
        duration_in_months: Number(planData.duration_in_months || 1),
        max_products: Number(planData.max_products || 100),
        max_stores: Number(planData.max_stores || 5),
        max_customers: Number(planData.max_customers || 10),
        is_active: Boolean(planData.is_active)
      };
      
      await createPlanMutation.mutateAsync(formattedData as SubscriptionPlanData);
      setCreateDialogOpen(false);
      setSuccessMessage('Subscription plan created successfully');
      reset(defaultValues);
    } catch (error: any) {
      console.error('Error creating subscription plan:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to create subscription plan';
      setSuccessMessage('');
      // Use the Snackbar system instead of alert for consistent UX
      setSuccessMessage(`Error: ${errorMessage}`);
    }
  };
  
  const handleEditSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      if (data.id) {
        const { id, ...planData } = data;
        
        // Get the current plan data to compare
        const currentPlan = subscriptionPlans?.find(p => p.id === id);
        if (!currentPlan) {
          throw new Error("Couldn't find the current plan data");
        }
        
        // Compare and only include changed fields to minimize data sent
        const changedFields: Record<string, any> = {};
        
        // Check each field for changes
        if (planData.name !== currentPlan.name) changedFields.name = planData.name;
        if (planData.description !== currentPlan.description) changedFields.description = planData.description;
        if (planData.price !== currentPlan.price) changedFields.price = planData.price;
        if (planData.billing_cycle !== currentPlan.billing_cycle) changedFields.billing_cycle = planData.billing_cycle;
        if (planData.is_active !== currentPlan.is_active) changedFields.is_active = planData.is_active;
        
        // For numeric fields, compare and convert if changed
        if (planData.duration_in_months !== currentPlan.duration_in_months) 
          changedFields.duration_in_months = Number(planData.duration_in_months || 1);
        
        if (planData.max_products !== currentPlan.max_products) 
          changedFields.max_products = Number(planData.max_products || 100);
        
        if (planData.max_stores !== currentPlan.max_stores) 
          changedFields.max_stores = Number(planData.max_stores || 5);
        
        if (planData.max_customers !== currentPlan.max_customers) 
          changedFields.max_customers = Number(planData.max_customers || 10);
          
        console.log('Sending only changed fields:', changedFields);
        
        // Try PUT with all data first (if any field changed)
        if (Object.keys(changedFields).length > 0) {
          try {
            // First try with PUT and all data
            await updatePlanMutation.mutateAsync({
              id,
              data: {
                ...planData,
                duration_in_months: Number(planData.duration_in_months || 1),
                max_products: Number(planData.max_products || 100),
                max_stores: Number(planData.max_stores || 5),
                max_customers: Number(planData.max_customers || 10),
                is_active: Boolean(planData.is_active)
              } as SubscriptionPlanData
            });
          } catch (putError) {
            console.error('PUT request failed, trying PATCH with only changed fields:', putError);
            // If PUT fails, try with PATCH and only changed fields
            await patchPlanMutation.mutateAsync({
              id,
              data: changedFields
            });
          }
          
          setEditDialogOpen(false);
          setSuccessMessage('Subscription plan updated successfully');
          reset(defaultValues);
        } else {
          // No changes detected
          setEditDialogOpen(false);
          setSuccessMessage('No changes were made to the subscription plan');
          reset(defaultValues);
        }
      }
    } catch (error: any) {
      console.error('Error updating subscription plan:', error);
      // Log more detailed error information
      console.error('Error response data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to update subscription plan';
      setSuccessMessage('');
      alert(`Error: ${errorMessage}`);
    }
  };
  
  const handleDeleteSubmit = async () => {
    try {
      const id = control._formValues.id;
      if (id) {
        await deletePlanMutation.mutateAsync(id);
        setDeleteDialogOpen(false);
        setSuccessMessage('Subscription plan deleted successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography variant="h4">
                {t('page_titles.subscription_plans')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('page_descriptions.subscription_plans')}
              </Typography>
            </Stack>
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={handleCreateDialogOpen}
            >
              {t('subscription_plans.add')}
            </Button>
          </Stack>
          
          {/* Search field */}
          <TextField
            fullWidth
            placeholder={t('subscription_plans.search_placeholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlass />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {plansError && (
            <Alert severity="error">{(plansError as any)?.message || t('subscription_plans.error.load')}</Alert>
          )}
          
          {createPlanMutation.isError && (
            <Alert severity="error">{(createPlanMutation.error as any)?.message || t('subscription_plans.error.create')}</Alert>
          )}
          
          {updatePlanMutation.isError && (
            <Alert severity="error">{(updatePlanMutation.error as any)?.message || t('subscription_plans.error.update')}</Alert>
          )}
          
          {deletePlanMutation.isError && (
            <Alert severity="error">{(deletePlanMutation.error as any)?.message || t('subscription_plans.error.delete')}</Alert>
          )}
          
          {patchPlanMutation.isError && (
            <Alert severity="error">{(patchPlanMutation.error as any)?.message || t('subscription_plans.error.patch')}</Alert>
          )}
          
          <Card>
            <CardContent>
              {isLoadingPlans ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('subscription_plans.columns.name')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.price')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.billing_cycle')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.max_products')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.max_stores')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.max_customers')}</TableCell>
                        <TableCell>{t('subscription_plans.columns.status')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPlans?.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>{plan.name}</TableCell>
                          <TableCell>{plan.price}</TableCell>
                          <TableCell>
                            {plan.billing_cycle === 'monthly' ? t('subscription_plans.monthly') : t('subscription_plans.yearly')}
                          </TableCell>
                          <TableCell>{plan.max_products || 0}</TableCell>
                          <TableCell>{plan.max_stores || 0}</TableCell>
                          <TableCell>{plan.max_customers || 0}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  backgroundColor: plan.is_active ? 'success.light' : 'error.light',
                                  borderRadius: 1,
                                  color: 'white',
                                  display: 'inline-block',
                                  px: 1,
                                  py: 0.5
                                }}
                              >
                                {plan.is_active ? t('common.active') : t('common.inactive')}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="info"
                              onClick={() => handleViewDetails(plan)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M228,128c0,4.4-3.8,8-7.9,8a8.3,8.3,0,0,1-8.1-8,84,84,0,0,0-168,0,8.3,8.3,0,0,1-8.1,8c-4.1,0-7.9-3.6-7.9-8a100,100,0,0,1,200,0Zm-100,60a60,60,0,1,0-60-60A60.1,60.1,0,0,0,128,188Zm0-92a32,32,0,1,0,32,32A32,32,0,0,0,128,96Z"></path>
                              </svg>
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditDialogOpen(plan)}
                            >
                              <PencilSimple />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDialogOpen(plan)}
                            >
                              <Trash />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedPlans?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            {searchQuery 
                              ? t('subscription_plans.no_results') 
                              : t('subscription_plans.no_plans')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredPlans?.length || 0}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage={t('common.rows_per_page')}
                  />
                </TableContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Create/Edit Dialog Form */}
          {(createDialogOpen || editDialogOpen) && (
            <Dialog 
              open={createDialogOpen || editDialogOpen} 
              onClose={() => createDialogOpen ? setCreateDialogOpen(false) : setEditDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <form onSubmit={handleSubmit(createDialogOpen ? handleCreateSubmit : handleEditSubmit)}>
                <DialogTitle>
                  {createDialogOpen ? t('subscription_plans.create_title') : t('subscription_plans.edit_title')}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                  <Stack spacing={3}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('subscription_plans.form.name')}
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          fullWidth
                          required
                        />
                      )}
                    />
                    
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('subscription_plans.form.description')}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          fullWidth
                          multiline
                          rows={3}
                          required
                        />
                      )}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t('subscription_plans.form.price')}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            fullWidth
                            required
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        )}
                      />
                      
                      <Controller
                        name="billing_cycle"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.billing_cycle}>
                            <Typography variant="body2" gutterBottom>
                              {t('subscription_plans.form.billing_cycle')}
                            </Typography>
                            <Select {...field}>
                              <MenuItem value="monthly">{t('subscription_plans.monthly')}</MenuItem>
                              <MenuItem value="yearly">{t('subscription_plans.yearly')}</MenuItem>
                            </Select>
                            {errors.billing_cycle && (
                              <FormHelperText error>{errors.billing_cycle.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Controller
                        name="duration_in_months"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <TextField
                            {...rest}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            label={t('subscription_plans.form.duration')}
                            type="number"
                            error={!!errors.duration_in_months}
                            helperText={errors.duration_in_months?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Controller
                        name="max_products"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <TextField
                            {...rest}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            label={t('subscription_plans.form.max_products')}
                            type="number"
                            error={!!errors.max_products}
                            helperText={errors.max_products?.message}
                            fullWidth
                          />
                        )}
                      />
                      
                      <Controller
                        name="max_stores"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <TextField
                            {...rest}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            label={t('subscription_plans.form.max_stores')}
                            type="number"
                            error={!!errors.max_stores}
                            helperText={errors.max_stores?.message}
                            fullWidth
                          />
                        )}
                      />
                      
                      <Controller
                        name="max_customers"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                          <TextField
                            {...rest}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            label={t('subscription_plans.form.max_customers')}
                            type="number"
                            error={!!errors.max_customers}
                            helperText={errors.max_customers?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                    
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormControl fullWidth>
                          <Typography variant="body2" gutterBottom>
                            {t('subscription_plans.form.status')}
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: value ? 'success.light' : 'error.light',
                              borderRadius: 1,
                              color: 'white',
                              display: 'inline-block',
                              px: 2,
                              py: 1,
                              mt: 1
                            }}
                          >
                            {value ? t('common.active') : t('common.inactive')}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {t('subscription_plans.form.status_helper')}
                          </Typography>
                        </FormControl>
                      )}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button
                    onClick={() => createDialogOpen ? setCreateDialogOpen(false) : setEditDialogOpen(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : (createDialogOpen ? t('common.create') : t('common.update'))}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          )}

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t('subscription_plans.delete_title')}</DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText>
                {t('subscription_plans.delete_confirmation', { name: control._formValues.name })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button 
                onClick={handleDeleteSubmit} 
                color="error"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : t('common.delete')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Message */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>

          {/* Details Dialog */}
          <Dialog 
            open={detailsDialogOpen} 
            onClose={() => setDetailsDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            {selectedPlan && (
              <>
                <DialogTitle>
                  {t('subscription_plans.details_title')}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {selectedPlan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {selectedPlan.description}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.price')}
                      </Typography>
                      <Typography variant="body1">
                        ${selectedPlan.price}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.billing_cycle')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.billing_cycle === 'monthly' ? t('subscription_plans.monthly') : t('subscription_plans.yearly')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.max_products')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_products}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.max_stores')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_stores}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.max_customers')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_customers}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.columns.status')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.is_active ? t('common.active') : t('common.inactive')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t('subscription_plans.form.duration')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.duration_in_months} {t('subscription_plans.months', 'months')}
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDetailsDialogOpen(false)}>
                    {t('common.close')}
                  </Button>
                  <Button 
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleEditDialogOpen(selectedPlan);
                    }}
                  >
                    {t('subscription_plans.edit_plan')}
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
} 