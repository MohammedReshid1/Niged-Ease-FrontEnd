'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { STORE_CHANGED_EVENT, useStore } from '@/providers/store-provider';
import { financialsApi, Receivable } from '@/services/api/financials';
import { transactionsApi } from '@/services/api/transactions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useCurrentUser } from '@/hooks/use-auth';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

export default function ReceivablesPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedReceivables, setSelectedReceivables] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [receivableToDelete, setReceivableToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [receivables, setReceivables] = React.useState<Receivable[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();

  // Fetch receivables
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Fetching receivables for store: ${currentStore.name} (${currentStore.id})`);
      const receivablesData = await financialsApi.getReceivables(currentStore.id);
      setReceivables(receivablesData);
    } catch (error) {
      console.error('Error fetching receivables:', error);
      enqueueSnackbar(t('common.error'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore, t]);

  useEffect(() => {
    if (!isLoadingUser && currentStore) {
      fetchData();
    }
  }, [fetchData, isLoadingUser, currentStore]);

  // Listen for store change events
  useEffect(() => {
    const handleStoreChange = (event: Event) => {
      // Force refetch data when store changes
      if (currentStore) {
        // Small delay to ensure store context has been updated
        setTimeout(() => {
          fetchData();
        }, 100);
      }
    };

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);

    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchData]);

  // Filter receivables by search query
  const filteredReceivables = searchQuery
    ? receivables.filter(
        (receivable) =>
          receivable.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receivable.sale.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : receivables;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleDeleteReceivable = (id: string) => {
    setReceivableToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!receivableToDelete || !currentStore) {
      enqueueSnackbar(t('common.no_selection'), { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await financialsApi.deleteReceivable(currentStore.id, receivableToDelete);

      // Remove the deleted receivable from the state
      setReceivables(receivables.filter((receivable) => receivable.id !== receivableToDelete));

      enqueueSnackbar('Receivable deleted successfully', { variant: 'success' });
      setIsDeleteModalOpen(false);
      setReceivableToDelete(null);
    } catch (error) {
      console.error('Error deleting receivable:', error);
      enqueueSnackbar('Error deleting receivable', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD', // Default to USD if currency not specified
    });
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.admin.dashboard },
    { label: 'Parties', url: paths.admin.parties },
    { label: 'Receivables', url: '/admin/parties/receivables' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Receivables
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

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search receivables"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      {/* Receivables Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sale ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading receivables...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredReceivables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography>No receivables found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReceivables.map((receivable) => {
                const isMenuOpen = Boolean(anchorElMap[receivable.id]);
                const formattedDate = format(new Date(receivable.created_at), 'MMM dd, yyyy');

                return (
                  <TableRow hover key={receivable.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{receivable.id.substring(0, 8)}</Typography>
                    </TableCell>
                    <TableCell>{receivable.sale.substring(0, 8)}</TableCell>
                    <TableCell>{formatCurrency(receivable.amount)}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label="UNPAID"
                        size="small"
                        sx={{
                          bgcolor: 'error.100',
                          color: 'error.main',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(event) => handleMenuOpen(event, receivable.id)}>
                        <DotsThreeIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElMap[receivable.id]}
                        open={isMenuOpen}
                        onClose={() => handleMenuClose(receivable.id)}
                      >
                        <MenuItem onClick={() => handleDeleteReceivable(receivable.id)}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Receivable"
        message="Are you sure you want to delete this receivable? This action cannot be undone."
      />
    </Box>
  );
}
