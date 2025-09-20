'use client';

import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { ExpenseCategory } from '@/services/api/financials';
import { PaymentMode } from '@/services/api/transactions';
import { Currency } from '@/services/api/companies';

interface ExpenseAddProps {
  categories: ExpenseCategory[];
  paymentModes: PaymentMode[];
  currencies: Currency[];
  storeId: string;
  onSubmit: (data: any) => void;
}

export const ExpenseAdd: React.FC<ExpenseAddProps> = ({
  categories,
  paymentModes,
  currencies,
  storeId,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState({
    store_id: storeId,
    expense_category: '',
    amount: '',
    description: '',
    currency: currencies.length > 0 ? currencies[0].id : '',
    payment_mode: '',
  });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      store_id: storeId,
      expense_category: '',
      amount: '',
      description: '',
      currency: currencies.length > 0 ? currencies[0].id : '',
      payment_mode: '',
    });
  };

  return (
    <Card>
      <CardHeader title="Add New Expense" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="expense_category"
                  value={formData.expense_category}
                  label="Category"
                  onChange={handleSelectChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  name="payment_mode"
                  value={formData.payment_mode}
                  label="Payment Mode"
                  onChange={handleSelectChange}
                >
                  {paymentModes.map(mode => (
                    <MenuItem key={mode.id} value={mode.id}>{mode.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleTextFieldChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    {currencies.find(c => c.id === formData.currency)?.code || '$'}
                  </InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Currency"
                  onChange={handleSelectChange}
                >
                  {currencies.map(currency => (
                    <MenuItem key={currency.id} value={currency.id}>
                      {currency.name} ({currency.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleTextFieldChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<PlusIcon />}
                sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
              >
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}; 