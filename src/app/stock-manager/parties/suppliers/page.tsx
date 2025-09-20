'use client';

import * as React from 'react';
import { useState } from 'react';
import { useStore } from '@/providers/store-provider';
import { Supplier, SupplierCreateData, transactionsApi } from '@/services/api/transactions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
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

import SupplierEditModal, { SupplierFormData } from '@/components/admin/parties/SupplierEditModal';

export default function SuppliersPage(): React.JSX.Element {
  const [selectedSuppliers, setSelectedSuppliers] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<SupplierFormData | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { currentStore } = useStore();

  // Fetch suppliers
  const fetchSuppliers = React.useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await transactionsApi.getSuppliers(currentStore.id);
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      enqueueSnackbar('Failed to load suppliers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore]);

  React.useEffect(() => {
    if (currentStore) {
      fetchSuppliers();
    }
  }, [fetchSuppliers, currentStore]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSuppliers(suppliers.map((supplier) => supplier.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter((supplierId) => supplierId !== id));
    } else {
      setSelectedSuppliers([...selectedSuppliers, id]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddModal = () => {
    setCurrentSupplier(undefined);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setCurrentSupplier({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      is_active: supplier.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveSupplier = async (supplierData: SupplierFormData) => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    try {
      const supplierPayload: SupplierCreateData = {
        store_id: currentStore.id,
        name: supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address || '',
        is_active: supplierData.is_active,
      };

      if (supplierData.id) {
        // Update existing supplier
        await transactionsApi.updateSupplier(currentStore.id, supplierData.id, supplierPayload);
        enqueueSnackbar('Supplier updated successfully', { variant: 'success' });
      } else {
        // Add new supplier
        await transactionsApi.createSupplier(currentStore.id, supplierPayload);
        enqueueSnackbar('Supplier added successfully', { variant: 'success' });
      }

      // Refresh the supplier list
      fetchSuppliers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving supplier:', error);
      enqueueSnackbar('Failed to save supplier', { variant: 'error' });
    }
  };

  const handleOpenDeleteDialog = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleDeleteSupplier = async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    if (supplierToDelete) {
      try {
        await transactionsApi.deleteSupplier(currentStore.id, supplierToDelete);
        enqueueSnackbar('Supplier deleted successfully', { variant: 'success' });
        // Refresh the supplier list
        fetchSuppliers();
        // Clear selection if the deleted supplier was selected
        setSelectedSuppliers((prevSelected) => prevSelected.filter((id) => id !== supplierToDelete));
      } catch (error) {
        console.error('Error deleting supplier:', error);
        enqueueSnackbar('Failed to delete supplier', { variant: 'error' });
      }
    }
    handleCloseDeleteDialog();
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: '/stock-manager/dashboard' },
    { label: 'Parties', url: '/stock-manager/parties' },
    { label: 'Suppliers', url: '/stock-manager/parties/suppliers' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Suppliers
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
            Add New Supplier
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

      {/* Suppliers Table */}
      <Card>
        <Box sx={{ overflowX: 'auto', mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSuppliers.length === suppliers.length && suppliers.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={selectedSuppliers.length > 0 && selectedSuppliers.length < suppliers.length}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Loading suppliers...</Typography>
                  </TableCell>
                </TableRow>
              ) : suppliers.length > 0 ? (
                suppliers.map((supplier) => {
                  const isSelected = selectedSuppliers.includes(supplier.id);
                  return (
                    <TableRow key={supplier.id} hover selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelectOne(supplier.id)} />
                      </TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: supplier.is_active ? 'success.lighter' : 'error.lighter',
                            borderRadius: 1,
                            color: supplier.is_active ? 'success.main' : 'error.main',
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          {supplier.is_active ? 'Enabled' : 'Disabled'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton onClick={() => handleOpenEditModal(supplier)}>
                            <PencilSimpleIcon size={20} />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleOpenDeleteDialog(supplier.id)}>
                            <TrashIcon size={20} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No suppliers found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Add/Edit Modal */}
      {isEditModalOpen && (
        <SupplierEditModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSupplier}
          supplier={currentSupplier}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this supplier? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteSupplier} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
