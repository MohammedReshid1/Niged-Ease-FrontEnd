'use client';

import * as React from 'react';
import { useState } from 'react';
import { useStore } from '@/providers/store-provider';
import { Customer, CustomerCreateData, transactionsApi } from '@/services/api/transactions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';
import { useSnackbar } from 'notistack';

import CustomerEditModal, { CustomerFormData } from '@/components/admin/parties/CustomerEditModal';

export default function CustomersPage(): React.JSX.Element {
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerFormData | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { currentStore } = useStore();

  // Fetch customers
  const fetchCustomers = React.useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await transactionsApi.getCustomers(currentStore.id);
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      enqueueSnackbar('Failed to load customers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore]);

  React.useEffect(() => {
    if (currentStore) {
      fetchCustomers();
    }
  }, [fetchCustomers, currentStore]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddModal = () => {
    setCurrentCustomer(undefined);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setCurrentCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveCustomer = async (customerData: CustomerFormData) => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    try {
      const customerPayload: CustomerCreateData = {
        store_id: currentStore.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || '',
      };

      if (customerData.id) {
        // Update existing customer
        await transactionsApi.updateCustomer(currentStore.id, customerData.id, customerPayload);
        enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      } else {
        // Add new customer
        await transactionsApi.createCustomer(currentStore.id, customerPayload);
        enqueueSnackbar('Customer added successfully', { variant: 'success' });
      }

      // Refresh the customer list
      fetchCustomers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving customer:', error);
      enqueueSnackbar('Failed to save customer', { variant: 'error' });
    }
  };

  const handleOpenDeleteDialog = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleDeleteCustomer = async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    if (customerToDelete) {
      try {
        await transactionsApi.deleteCustomer(currentStore.id, customerToDelete);
        enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
        // Refresh the customer list
        fetchCustomers();
        // Clear selection if the deleted customer was selected
        setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerToDelete));
      } catch (error) {
        console.error('Error deleting customer:', error);
        enqueueSnackbar('Failed to delete customer', { variant: 'error' });
      }
    }
    handleCloseDeleteDialog();
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: '/salesman/dashboard' },
    { label: 'Parties', url: '/salesman/parties' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Customers
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Box component="span" sx={{ mx: 0.5 }}>
                  -
                </Box>
              )}
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

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleOpenAddModal}
          >
            Add New Customer
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Status...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Enabled">Enabled</MenuItem>
            <MenuItem value="Disabled">Disabled</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Customers Table */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < customers.length}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : customers.length > 0 ? (
                customers.map((customer) => {
                  const isSelected = selectedCustomers.includes(customer.id);
                  return (
                    <TableRow key={customer.id} hover selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelectOne(customer.id)} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: '#0ea5e9',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              mr: 1,
                            }}
                          >
                            {customer.name.charAt(0)}
                          </Box>
                          {customer.name}
                        </Box>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(customer)}
                            sx={{ color: '#0ea5e9' }}
                          >
                            <PencilSimpleIcon size={18} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#0f766e' }}>
                            <EyeIcon size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#ef4444' }}
                            onClick={() => handleOpenDeleteDialog(customer.id)}
                          >
                            <TrashIcon size={18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No customers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Customer Edit Modal */}
      {isEditModalOpen && (
        <CustomerEditModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          customer={currentCustomer}
          onSave={handleSaveCustomer}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCustomer} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
