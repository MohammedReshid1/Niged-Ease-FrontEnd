'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Collapse, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField 
} from '@mui/material';
import { FunnelSimple as FilterIcon } from '@phosphor-icons/react/dist/ssr/FunnelSimple';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';
import { SelectChangeEvent } from '@mui/material/Select';

interface FilterOption {
  id: string;
  name: string;
  code?: string;
}

interface FilterComponentProps {
  onApplyFilter?: (filters: any) => void;
  categories?: FilterOption[];
  paymentModes?: FilterOption[];
  currencies?: FilterOption[];
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  onApplyFilter,
  categories = [],
  paymentModes = [],
  currencies = [],
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    paymentMode: '',
    currency: '',
    minAmount: '',
    maxAmount: '',
    fromDate: '',
    toDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
  };

  const handleClearFilter = () => {
    setFilters({
      category: '',
      paymentMode: '',
      currency: '',
      minAmount: '',
      maxAmount: '',
      fromDate: '',
      toDate: '',
    });
    if (onApplyFilter) {
      onApplyFilter({});
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        startIcon={<FilterIcon />}
        variant="outlined"
        onClick={() => setOpen(!open)}
        sx={{ mb: 2 }}
      >
        {open ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <Collapse in={open}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={filters.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Mode</InputLabel>
                  <Select
                    name="paymentMode"
                    value={filters.paymentMode}
                    label="Payment Mode"
                    onChange={handleChange}
                  >
                    <MenuItem value="">All Payment Modes</MenuItem>
                    {paymentModes.map(mode => (
                      <MenuItem key={mode.id} value={mode.id}>{mode.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={filters.currency}
                    label="Currency"
                    onChange={handleChange}
                  >
                    <MenuItem value="">All Currencies</MenuItem>
                    {currencies.map(currency => (
                      <MenuItem key={currency.id} value={currency.id}>
                        {currency.name} {currency.code ? `(${currency.code})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  name="minAmount"
                  label="Min Amount"
                  type="number"
                  value={filters.minAmount}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  name="maxAmount"
                  label="Max Amount"
                  type="number"
                  value={filters.maxAmount}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  name="fromDate"
                  label="From Date"
                  type="date"
                  value={filters.fromDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  name="toDate"
                  label="To Date"
                  type="date"
                  value={filters.toDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearFilter}
                    startIcon={<CloseIcon />}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleApplyFilter}
                    sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
                    startIcon={<FilterIcon />}
                  >
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
}; 