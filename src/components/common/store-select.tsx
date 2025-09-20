import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import { useStore } from '@/providers/store-provider';

export const StoreSelect = () => {
  const { stores, currentStore, selectStore, isLoading } = useStore();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    const selectedStore = stores.find((store) => store.id === selectedId);
    if (selectedStore) {
      selectStore(selectedStore);
    }
  };

  return (
    <Box sx={{ minWidth: 200, maxWidth: 300 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="store-select-label">Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="store-select"
          value={currentStore?.id || ''}
          label="Store"
          onChange={handleChange}
          disabled={isLoading}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
          {stores.length === 0 && (
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                No stores available
              </Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}; 