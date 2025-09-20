'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { PaymentOutCreateData, Payable, financialsApi } from '@/services/api/financials';
import { Purchase, transactionsApi, PaymentMode } from '@/services/api/transactions';
import { Company, companiesApi, Currency } from '@/services/api/companies';
import { useStore } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';

interface PaymentOutEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PaymentOutCreateData) => void;
  payment: PaymentOutCreateData & { id?: string };
}

export default function PaymentOutEditModal({
  open,
  onClose,
  onSave,
  payment
}: PaymentOutEditModalProps): React.JSX.Element {
  const [formData, setFormData] = useState<PaymentOutCreateData & { id?: string }>(payment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  
  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (!currentStore) {
          enqueueSnackbar('No store selected', { variant: 'warning' });
          return;
        }
        
        // Now get payment modes, payables, purchases and currencies
        const [paymentModesData, payablesData, purchasesData, currenciesData] = await Promise.all([
          transactionsApi.getPaymentModes(currentStore.id),
          financialsApi.getPayables(currentStore.id),
          transactionsApi.getPurchases(currentStore.id),
          companiesApi.getCurrencies()
        ]);
        
        // Update form data with store_id
        setFormData(prev => ({
          ...prev,
          store_id: currentStore.id
        }));
        
        setPaymentModes(paymentModesData);
        setPayables(payablesData);
        setPurchases(purchasesData);
        setCurrencies(currenciesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Failed to load data', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [currentStore, enqueueSnackbar]);
  
  // Reset form data when modal opens with new payment data
  useEffect(() => {
    if (open) {
      setFormData(payment);
      setErrors({});
    }
  }, [payment, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.store_id) {
      newErrors.store_id = 'Store is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.payment_mode_id) {
      newErrors.payment_mode_id = 'Payment method is required';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{payment.id ? 'Edit Payment Out' : 'Add Payment Out'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.store_id}>
              <InputLabel id="store-select-label">Store</InputLabel>
              <Select
                labelId="store-select-label"
                id="store_id"
                name="store_id"
                value={formData.store_id || ''}
                label="Store"
                onChange={handleSelectChange}
                disabled={true} // Disable since we're setting it automatically
              >
                <MenuItem value={formData.store_id || ''}>Current Store</MenuItem>
              </Select>
              {errors.store_id && <FormHelperText>{errors.store_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payable}>
              <InputLabel id="payable-select-label">Payable</InputLabel>
              <Select
                labelId="payable-select-label"
                id="payable"
                name="payable"
                value={formData.payable || ''}
                label="Payable"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Payable</MenuItem>
                {payables.map(payable => (
                  <MenuItem key={payable.id} value={payable.id}>
                    {payable.id} - ${parseFloat(payable.amount).toLocaleString()}
                  </MenuItem>
                ))}
              </Select>
              {errors.payable && <FormHelperText>{errors.payable}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.purchase}>
              <InputLabel id="purchase-select-label">Purchase</InputLabel>
              <Select
                labelId="purchase-select-label"
                id="purchase"
                name="purchase"
                value={formData.purchase || ''}
                label="Purchase"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Purchase</MenuItem>
                {purchases.map(purchase => (
                  <MenuItem key={purchase.id} value={purchase.id}>
                    {purchase.id}
                  </MenuItem>
                ))}
              </Select>
              {errors.purchase && <FormHelperText>{errors.purchase}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount || ''}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.currency}>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency"
                name="currency"
                value={formData.currency || ''}
                label="Currency"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Currency</MenuItem>
                {currencies.map(currency => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.name} ({currency.code})
                  </MenuItem>
                ))}
              </Select>
              {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payment_mode_id}>
              <InputLabel id="payment-mode-select-label">Payment Method</InputLabel>
              <Select
                labelId="payment-mode-select-label"
                id="payment_mode_id"
                name="payment_mode_id"
                value={formData.payment_mode_id || ''}
                label="Payment Method"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Payment Method</MenuItem>
                {paymentModes.map(mode => (
                  <MenuItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.payment_mode_id && <FormHelperText>{errors.payment_mode_id}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {payment.id ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 