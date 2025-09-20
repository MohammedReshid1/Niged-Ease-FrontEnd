'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useStore } from '@/providers/store-provider';
import { stockTransfersApi, StockTransfer, CreateStockTransferRequest } from '@/services/api/stock-transfers';
import { inventoryApi, InventoryStore, Product } from '@/services/api/inventory';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as DeleteIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { useRouter } from 'next/navigation';
import { StockManagerGuard } from '@/components/auth/stock-manager-guard';

export default function StockTransfersPage() {
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<CreateStockTransferRequest>({
    source_store: '',
    destination_store: '',
    product: '',
    quantity: 0,
    notes: '',
  });

  useEffect(() => {
    if (currentStore?.id) {
      fetchTransfers();
      fetchStoresAndProducts();
    }
  }, [currentStore?.id]);

  const fetchStoresAndProducts = async () => {
    try {
      const [storesData, productsData] = await Promise.all([
        inventoryApi.getStores(),
        inventoryApi.getProducts(currentStore!.id)
      ]);
      setStores(storesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching stores and products:', error);
      enqueueSnackbar('Failed to load stores and products', { variant: 'error' });
    }
  };

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const data = await stockTransfersApi.getStoreTransfers(currentStore!.id);
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      enqueueSnackbar('Failed to load stock transfers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (transfer?: StockTransfer) => {
    if (transfer) {
      // Only allow editing if the transfer is pending and the current store is the source store
      if (transfer.status !== 'pending' || transfer.source_store !== currentStore?.id) {
        enqueueSnackbar('You can only edit pending transfers from your store', { variant: 'warning' });
        return;
      }
      setIsEditMode(true);
      setSelectedTransfer(transfer);
      setFormData({
        source_store: transfer.source_store,
        destination_store: transfer.destination_store,
        product: transfer.product,
        quantity: transfer.quantity,
        notes: transfer.notes,
      });
    } else {
      setIsEditMode(false);
      setSelectedTransfer(null);
      setFormData({
        source_store: currentStore!.id,
        destination_store: '',
        product: '',
        quantity: 0,
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransfer(null);
    setFormData({
      source_store: '',
      destination_store: '',
      product: '',
      quantity: 0,
      notes: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedTransfer) {
        await stockTransfersApi.updateTransfer(currentStore!.id, selectedTransfer.id, formData);
        enqueueSnackbar('Transfer updated successfully', { variant: 'success' });
      } else {
        await stockTransfersApi.createTransfer(currentStore!.id, formData);
        enqueueSnackbar('Transfer created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      fetchTransfers();
    } catch (error) {
      console.error('Error saving transfer:', error);
      enqueueSnackbar('Failed to save transfer', { variant: 'error' });
    }
  };

  const handleCancelTransfer = async (transferId: string) => {
    try {
      await stockTransfersApi.cancelTransfer(currentStore!.id, transferId);
      enqueueSnackbar('Transfer cancelled successfully', { variant: 'success' });
      fetchTransfers();
    } catch (error) {
      console.error('Error cancelling transfer:', error);
      enqueueSnackbar('Failed to cancel transfer', { variant: 'error' });
    }
  };

  const handleBack = () => {
    router.push('/stock-manager/dashboard');
  };

  if (!currentStore?.id) {
    return (
      <Container>
        <Box sx={{ py: 3 }}>
          <Alert severity="info">
            Please select a store from the store selector to view stock transfers.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <StockManagerGuard>
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
              Stock Transfers
            </Typography>
          </Box>

          <Card>
            <CardHeader
              title="Stock Transfers"
              action={
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog()}
                >
                  New Transfer
                </Button>
              }
            />
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Source Store</TableCell>
                        <TableCell>Destination Store</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>{transfer.id}</TableCell>
                          <TableCell>
                            {stores.find(s => s.id === transfer.source_store)?.name || transfer.source_store}
                          </TableCell>
                          <TableCell>
                            {stores.find(s => s.id === transfer.destination_store)?.name || transfer.destination_store}
                          </TableCell>
                          <TableCell>
                            {products.find(p => p.id === transfer.product)?.name || transfer.product}
                          </TableCell>
                          <TableCell>{transfer.quantity}</TableCell>
                          <TableCell>{transfer.status}</TableCell>
                          <TableCell>{transfer.notes}</TableCell>
                          <TableCell>{new Date(transfer.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            {transfer.status === 'pending' && transfer.source_store === currentStore.id && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(transfer)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCancelTransfer(transfer.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {isEditMode ? 'Edit Transfer' : 'New Transfer'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Destination Store</InputLabel>
                      <Select
                        value={formData.destination_store}
                        onChange={(e) => setFormData({ ...formData, destination_store: e.target.value })}
                        label="Destination Store"
                      >
                        {stores
                          .filter(store => store.id !== currentStore.id) // Exclude current store
                          .map(store => (
                            <MenuItem key={store.id} value={store.id}>
                              {store.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Product</InputLabel>
                      <Select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        label="Product"
                      >
                        {products.map(product => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </StockManagerGuard>
  );
} 