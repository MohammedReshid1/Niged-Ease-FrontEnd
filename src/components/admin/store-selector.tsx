'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/providers/store-provider';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip, Typography, SelectChangeEvent, IconButton, CircularProgress, Alert } from '@mui/material';
import { Storefront, ArrowsClockwise } from '@phosphor-icons/react/dist/ssr';

export default function StoreSelector() {
  const { stores, currentStore, selectStore, refreshStores, isLoading } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh stores when component mounts to ensure fresh data
    const loadStores = async () => {
      try {
        setError(null);
        refreshStores();
      } catch (err) {
        setError('Failed to load stores. Please try again.');
        console.error('Error loading stores:', err);
      }
    };
    
    loadStores();
  }, []);

  const handleStoreChange = (event: SelectChangeEvent<string>) => {
    const storeId = event.target.value;
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      selectStore(store);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      refreshStores();
    } catch (err) {
      setError('Failed to refresh stores. Please try again.');
      console.error('Error refreshing stores:', err);
    } finally {
      // Add a slight delay to show the refresh animation
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <CircularProgress size={20} />
        <span>Loading stores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <Alert severity="error" sx={{ fontSize: '0.75rem', py: 0 }}>
          {error}
        </Alert>
        <IconButton onClick={handleRefresh} size="small">
          <ArrowsClockwise size={18} />
        </IconButton>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Tooltip title="No stores available">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Storefront size={20} />
            <Typography variant="body2">No stores</Typography>
          </Box>
        </Tooltip>
        <IconButton onClick={handleRefresh} size="small">
          <ArrowsClockwise size={18} />
        </IconButton>
      </div>
    );
  }

  // Always show dropdown for switching between stores, even if user has a currentStore
  return (
    <div className="flex items-center gap-2">
      <FormControl variant="outlined" size="small" sx={{ 
        minWidth: { xs: 120, sm: 180 },
        maxWidth: { xs: '35vw', sm: 'none' }
      }}>
        <Select
          value={currentStore?.id || ''}
          onChange={handleStoreChange}
          displayEmpty
          className="text-sm"
          sx={{ 
            borderRadius: '0.375rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--secondary-200)',
            },
            // Truncate long store names on small screens
            '& .MuiSelect-select': {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }
          }}
        >
          <MenuItem value="" disabled>
            Select Store
          </MenuItem>
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Refresh stores">
        <IconButton 
          onClick={handleRefresh} 
          className={`transition-all duration-300 ${refreshing ? 'animate-spin' : ''}`}
          size="small"
        >
          <ArrowsClockwise size={18} />
        </IconButton>
      </Tooltip>
    </div>
  );
} 