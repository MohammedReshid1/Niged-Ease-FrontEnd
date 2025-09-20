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
import { ExpenseCreateData, ExpenseCategory } from '@/services/api/financials';
import { PaymentMode, transactionsApi } from '@/services/api/transactions';
import { useCurrentUser } from '@/hooks/use-auth';
import CircularProgress from '@mui/material/CircularProgress';
import { companiesApi, Currency, Company } from '@/services/api/companies';

interface ExpenseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseCreateData & { id?: string }) => void;
  expense: Partial<ExpenseCreateData> & { id?: string };
  categories: ExpenseCategory[];
  paymentModes?: PaymentMode[];
  currencies?: Currency[];
}

export default function ExpenseEditModal({
  open,
  onClose,
  onSave,
  expense,
  categories,
  paymentModes: propPaymentModes = [],
  currencies: propCurrencies = []
}: ExpenseEditModalProps): React.JSX.Element {
  const [formData, setFormData] = useState<Partial<ExpenseCreateData> & { id?: string }>(expense);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>(propPaymentModes);
  const [currencies, setCurrencies] = useState<Currency[]>(propCurrencies);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(propPaymentModes.length === 0 || propCurrencies.length === 0);
  const { userInfo, isLoading: isUserLoading } = useCurrentUser();
  
  // Load payment modes and currencies from API if needed
  useEffect(() => {
    // Skip API calls if data is already provided via props
    if (propPaymentModes.length > 0 && propCurrencies.length > 0) {
      setPaymentModes(propPaymentModes);
      setCurrencies(propCurrencies);
      setIsLoading(false);
      return;
    }
    
    // Only fetch data when the modal is open
    if (!open) {
      return;
    }
    
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get companies first to get the store ID
        const companiesData = await companiesApi.getCompanies();
        setCompanies(companiesData);
        
        // Find a company to use for store ID
        let companyId = '';
        if (userInfo && userInfo.company_id) {
          companyId = userInfo.company_id;
        } else if (companiesData.length > 0) {
          companyId = companiesData[0].id;
        }
        
        if (companyId) {
          // Get stores for the company
          const stores = await companiesApi.getStores(companyId);
          
          if (stores.length > 0) {
            const storeId = stores[0].id;
            setCurrentStoreId(storeId);
            
            // Now get payment modes and currencies
            const [modesData, currencyData] = await Promise.all([
              transactionsApi.getPaymentModes(storeId),
              companiesApi.getCurrencies(),
            ]);
            
            setPaymentModes(modesData);
            setCurrencies(currencyData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [userInfo, propPaymentModes, propCurrencies, open]);
  
  // Reset form data when modal opens with new expense data
  useEffect(() => {
    if (open) {
      console.log('Modal opened, setting form data with:', expense);
      
      // Use the current store ID or keep the existing one from the expense
      const storeId = expense.store_id || currentStoreId || '';
      
      setFormData({
        ...expense,
        store_id: storeId
      });
      
      setErrors({});
    }
  }, [expense, open, currentStoreId]);

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

  const handleSubmit = () => {
    console.log('handleSubmit called, validating form');
    
    // Create a new errors object for validation
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.expense_category) {
      newErrors.expense_category = 'Category is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount.toString()) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.payment_mode) {
      newErrors.payment_mode = 'Payment method is required';
    }
    
    // Update the errors state
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.keys(newErrors).length === 0) {
      console.log('Form validation passed');
      
      // Use the current store ID if available
      const storeId = formData.store_id || currentStoreId;
      
      if (!storeId) {
        setErrors(prev => ({
          ...prev,
          store_id: "Unable to determine store ID. Please try again later."
        }));
        return;
      }
      
      // Make sure we have all required fields before submitting
      const completeData: ExpenseCreateData & { id?: string } = {
        store_id: storeId,
        expense_category: formData.expense_category || '',
        amount: formData.amount?.toString() || '',
        description: formData.description || '',
        currency: formData.currency || '',
        payment_mode: formData.payment_mode || '',
        ...(formData.id ? { id: formData.id } : {})
      };
      
      console.log('Submitting complete data:', completeData);
      onSave(completeData);
    } else {
      console.log('Form validation failed, errors:', newErrors);
    }
  };

  // Get currency code for display
  const getCurrencyCode = (currencyId: string) => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.code : '';
  };

  if (isLoading || isUserLoading) {
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
      <DialogTitle>{expense.id ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.expense_category}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="expense_category"
                name="expense_category"
                value={formData.expense_category || ''}
                label="Category"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Category</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.expense_category && <FormHelperText>{errors.expense_category}</FormHelperText>}
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
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
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
                <MenuItem value="">Select a Currency</MenuItem>
                {currencies.map(currency => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code}
                  </MenuItem>
                ))}
              </Select>
              {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payment_mode}>
              <InputLabel id="payment-method-select-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-select-label"
                id="payment_mode"
                name="payment_mode"
                value={formData.payment_mode || ''}
                label="Payment Method"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Payment Method</MenuItem>
                {paymentModes.map(mode => (
                  <MenuItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.payment_mode && <FormHelperText>{errors.payment_mode}</FormHelperText>}
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
          {expense.id ? 'Save Changes' : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 