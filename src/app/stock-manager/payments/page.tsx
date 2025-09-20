'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import PaymentOutEditModal from '@/components/admin/payments/PaymentOutEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { paymentsApi, PaymentOut } from '@/services/api/payments';
import { transactionsApi, Supplier } from '@/services/api/transactions';
import { useSnackbar } from 'notistack';
import { useStore } from '@/providers/store-provider';

export default function PaymentOutPage(): React.JSX.Element {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<any>({});
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { currentStore } = useStore();
  
  // Fetch payments and suppliers
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [paymentsData, suppliersData] = await Promise.all([
        paymentsApi.getPaymentsOut(currentStore.id),
        transactionsApi.getSuppliers(currentStore.id)
      ]);
      setPayments(paymentsData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load payments', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore]);

  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPayments(payments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(selectedPayments.filter(paymentId => paymentId !== id));
    } else {
      setSelectedPayments([...selectedPayments, id]);
    }
  };

  const handleAddNewPayment = () => {
    setCurrentPayment({
      company: "",
      payable: "",
      purchase: "",
      amount: "0",
      currency: "",
      payment_mode_id: ""
    });
    setIsPaymentModalOpen(true);
  };

  const handleEditPayment = (id: string) => {
    const paymentToEdit = payments.find(payment => payment.id === id);
    if (paymentToEdit) {
      setCurrentPayment({
        id: paymentToEdit.id,
        store_id: paymentToEdit.store_id,
        payable: paymentToEdit.payable,
        purchase: paymentToEdit.purchase,
        amount: paymentToEdit.amount,
        currency: paymentToEdit.currency,
        payment_mode_id: paymentToEdit.payment_mode.id
      });
      setIsPaymentModalOpen(true);
    }
  };

  const handleDeletePayment = (id: string) => {
    setPaymentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    if (paymentToDelete) {
      try {
        await paymentsApi.deletePaymentOut(currentStore.id, paymentToDelete);
        enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
        fetchData();
        setIsDeleteModalOpen(false);
        setPaymentToDelete(null);
      } catch (error) {
        console.error('Error deleting payment:', error);
        enqueueSnackbar('Failed to delete payment', { variant: 'error' });
      }
    }
  };

  const handleSavePayment = async (paymentData: any) => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    try {
      // Make sure the payment data includes the store_id
      const paymentWithStore = {
        ...paymentData,
        store_id: currentStore.id
      };
      
      if (paymentData.id) {
        // Update existing payment
        await paymentsApi.updatePaymentOut(currentStore.id, paymentData.id, paymentWithStore);
        enqueueSnackbar('Payment updated successfully', { variant: 'success' });
      } else {
        // Add new payment
        await paymentsApi.createPaymentOut(paymentWithStore);
        enqueueSnackbar('Payment added successfully', { variant: 'success' });
      }
      fetchData();
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error saving payment:', error);
      enqueueSnackbar('Failed to save payment', { variant: 'error' });
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Payments', url: paths.stockManager.payments },
    { label: 'Payment Out', url: paths.stockManager.paymentOut },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Payment Out</Typography>
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

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewPayment}
          >
            Add New Payment
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search payments..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            }
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      {/* Payments Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={payments.length > 0 && selectedPayments.length === payments.length}
                    indeterminate={selectedPayments.length > 0 && selectedPayments.length < payments.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => {
                  const isSelected = selectedPayments.includes(payment.id);
                  const createdDate = new Date(payment.created_at).toLocaleDateString();
                  const supplier = suppliers.find(s => s.id === payment.payable);
                  
                  return (
                    <TableRow key={payment.id} hover selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectOne(payment.id)}
                        />
                      </TableCell>
                      <TableCell>{supplier?.name || 'Unknown Supplier'}</TableCell>
                      <TableCell>{parseFloat(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell>{payment.payment_mode.name}</TableCell>
                      <TableCell>{createdDate}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditPayment(payment.id)}
                            sx={{ color: '#0ea5e9' }}
                          >
                            <PencilSimpleIcon size={18} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#ef4444' }}
                            onClick={() => handleDeletePayment(payment.id)}
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
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No payments found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Payment Edit Modal */}
      {isPaymentModalOpen && (
        <PaymentOutEditModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSave={handleSavePayment}
          payment={currentPayment}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
      />
    </Box>
  );
} 