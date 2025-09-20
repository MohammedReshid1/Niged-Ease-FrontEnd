'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { useStore } from '@/providers/store-provider';
import { useAuth } from '@/providers/auth-provider';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorefrontIcon from '@mui/icons-material/Storefront';

export const StoreSelector = () => {
  const { currentStore, stores, selectStore, refreshStores, isLoading } = useStore();
  const { userRole } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Refresh stores when component mounts
    refreshStores();
  }, []);

  // Only show store selector for admin who can have multiple stores
  if (userRole !== 'admin' && userRole !== 'super_admin') {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    const currentStoreId = event.target.value;
    const currentStore = stores.find(store => store.id === currentStoreId);
    if (currentStore) {
      selectStore(currentStore);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshStores();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // If no stores or loading, show appropriate message
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Loading stores...
        </Typography>
      </Box>
    );
  }

  if (stores.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Typography variant="body2" color="error" sx={{ mr: 1 }}>
          No stores available
        </Typography>
        <Tooltip title="Refresh stores">
          <IconButton size="small" onClick={handleRefresh} color="primary">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  // Otherwise show store selector
  return (
    <Box sx={{ minWidth: 180, display: 'flex', alignItems: 'center' }}>
      <StorefrontIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="store-select-label">Current Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="store-select"
          value={currentStore?.id || ''}
          label="Current Store"
          onChange={handleChange}
        >
          {stores.map(store => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Refresh stores">
        <IconButton 
          size="small" 
          onClick={handleRefresh} 
          color="primary"
          sx={{ ml: 1 }}
          disabled={isRefreshing}
        >
          <RefreshIcon 
            fontSize="small" 
            sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
          />
        </IconButton>
      </Tooltip>

      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
}; 