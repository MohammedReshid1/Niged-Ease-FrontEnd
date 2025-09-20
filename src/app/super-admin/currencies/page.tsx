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
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { useCurrencies, useCreateCurrency, useUpdateCurrency, useDeleteCurrency, usePatchCurrency } from '@/hooks/use-companies';

const currencySchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, 'Currency name is required'),
  code: zod.string().min(2, 'Currency code is required').max(3, 'Currency code must be 2-3 characters')
});

type CurrencyFormValues = zod.infer<typeof currencySchema>;

export default function CurrenciesPage(): React.JSX.Element {
  const { t } = useTranslation('superAdmin');
  const { data: currencies, isLoading: isLoadingCurrencies, error: currenciesError } = useCurrencies();
  const createCurrencyMutation = useCreateCurrency();
  const updateCurrencyMutation = useUpdateCurrency();
  const deleteCurrencyMutation = useDeleteCurrency();
  const patchCurrencyMutation = usePatchCurrency();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const defaultValues: CurrencyFormValues = {
    name: '',
    code: '',
  };
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues
  });
  
  const isLoading = isLoadingCurrencies || 
    createCurrencyMutation.isPending || 
    updateCurrencyMutation.isPending || 
    deleteCurrencyMutation.isPending ||
    patchCurrencyMutation.isPending;
  
  const handleCreateDialogOpen = () => {
    reset(defaultValues);
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (currency: any) => {
    setValue('id', currency.id);
    setValue('name', currency.name);
    setValue('code', currency.code);
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (currency: any) => {
    setValue('id', currency.id);
    setValue('name', currency.name);
    setValue('code', currency.code);
    setDeleteDialogOpen(true);
  };
  
  const handleCreateSubmit = async (data: CurrencyFormValues) => {
    try {
      await createCurrencyMutation.mutateAsync({
        name: data.name,
        code: data.code
      });
      setCreateDialogOpen(false);
      setSuccessMessage('Currency created successfully');
      reset(defaultValues);
    } catch (error) {
      console.error('Error creating currency:', error);
    }
  };
  
  const handleEditSubmit = async (data: CurrencyFormValues) => {
    try {
      if (data.id) {
        await updateCurrencyMutation.mutateAsync({
          id: data.id,
          data: {
            name: data.name,
            code: data.code
          }
        });
        setEditDialogOpen(false);
        setSuccessMessage('Currency updated successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };
  
  const handleDeleteSubmit = async () => {
    try {
      const id = control._formValues.id;
      if (id) {
        await deleteCurrencyMutation.mutateAsync(id);
        setDeleteDialogOpen(false);
        setSuccessMessage('Currency deleted successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error deleting currency:', error);
    }
  };
  
  // Quick edit for currency code using PATCH
  const handleQuickCodeUpdate = async (id: string, newCode: string) => {
    try {
      await patchCurrencyMutation.mutateAsync({
        id,
        data: { code: newCode }
      });
      setSuccessMessage('Currency code updated successfully');
    } catch (error) {
      console.error('Error updating currency code:', error);
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
                {t('page_titles.currencies')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('page_descriptions.currencies')}
              </Typography>
            </Stack>
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={handleCreateDialogOpen}
            >
              {t('currencies.add')}
            </Button>
          </Stack>
          
          {currenciesError && (
            <Alert severity="error">{(currenciesError as any)?.message || t('currencies.error.load')}</Alert>
          )}
          
          {createCurrencyMutation.isError && (
            <Alert severity="error">{(createCurrencyMutation.error as any)?.message || t('currencies.error.create')}</Alert>
          )}
          
          {updateCurrencyMutation.isError && (
            <Alert severity="error">{(updateCurrencyMutation.error as any)?.message || t('currencies.error.update')}</Alert>
          )}
          
          {deleteCurrencyMutation.isError && (
            <Alert severity="error">{(deleteCurrencyMutation.error as any)?.message || t('currencies.error.delete')}</Alert>
          )}
          
          {patchCurrencyMutation.isError && (
            <Alert severity="error">{(patchCurrencyMutation.error as any)?.message || t('currencies.error.update')}</Alert>
          )}
          
          <Card>
            <CardContent sx={{ position: 'relative' }}>
              {/* Global loading overlay */}
              {(createCurrencyMutation.isPending || 
                updateCurrencyMutation.isPending || 
                deleteCurrencyMutation.isPending || 
                patchCurrencyMutation.isPending) && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Stack alignItems="center" spacing={2}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                      {createCurrencyMutation.isPending ? t('currencies.loading.creating') :
                        updateCurrencyMutation.isPending ? t('currencies.loading.updating') :
                        deleteCurrencyMutation.isPending ? t('currencies.loading.deleting') :
                        t('currencies.loading.updating_code')}
                    </Typography>
                  </Stack>
                </Box>
              )}
              {isLoadingCurrencies ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('currencies.columns.name')}</TableCell>
                        <TableCell>{t('currencies.columns.code')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currencies?.map((currency) => (
                        <TableRow key={currency.id}>
                          <TableCell>{currency.name}</TableCell>
                          <TableCell>{currency.code}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditDialogOpen(currency)}
                            >
                              <PencilSimple />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDialogOpen(currency)}
                            >
                              <Trash />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {currencies?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            {t('currencies.no_currencies')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Create Dialog */}
          <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
            <DialogTitle>{t('currencies.create_title')}</DialogTitle>
            <form onSubmit={handleSubmit(handleCreateSubmit)}>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('currencies.form.name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('currencies.form.code')}
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCreateDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : t('common.create')}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>{t('currencies.edit_title')}</DialogTitle>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('currencies.form.name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('currencies.form.code')}
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : t('common.update')}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          
          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>{t('currencies.delete_title')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('currencies.delete_confirmation', { name: control._formValues.name })}
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
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </Box>
  );
} 