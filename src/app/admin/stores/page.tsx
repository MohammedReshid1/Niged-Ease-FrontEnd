'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useCurrentUser } from '@/hooks/use-auth';
import { useCheckCompanySubscription } from '@/hooks/use-companies';
import StoreEditModal from '@/components/admin/stores/StoreEditModal';

export default function StoresPage(): React.JSX.Element {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  const { t } = useTranslation('admin');

  const [isLoading, setIsLoading] = React.useState(true);
  const [stores, setStores] = React.useState<InventoryStore[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentStore, setCurrentStore] = React.useState<InventoryStore | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [storeToDelete, setStoreToDelete] = React.useState<string | null>(null);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});

  // Get subscription details
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useCheckCompanySubscription(
    userInfo?.company_id
  );

  // Fetch stores data
  const fetchStores = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // If user has a company_id, pass it to get only stores for that company
      const storesData = userInfo?.company_id
        ? await inventoryApi.getStores(userInfo.company_id)
        : await inventoryApi.getStores();

      // Filter stores by user's company
      const filteredStores = userInfo?.company_id
        ? storesData
        : storesData.filter((store) => store.company && userInfo?.role === 'superadmin');

      setStores(filteredStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      enqueueSnackbar(t('stores.loading_error'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, enqueueSnackbar, t]);

  // Load data on component mount
  React.useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Handle search
  const filteredStores = searchQuery
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stores;

  // Menu handling
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  // Add/Edit/Delete handlers
  const handleAddNewStore = () => {
    // Check subscription limits for stores
    if (subscriptionData && !isLoadingSubscription) {
      const { current_stores_count, max_stores } = subscriptionData;

      if (current_stores_count >= max_stores) {
        enqueueSnackbar(t('stores.subscription_limit', { max: max_stores }), {
          variant: 'error',
          autoHideDuration: 6000,
        });
        return;
      }
    }

    setCurrentStore(null);
    setIsStoreModalOpen(true);
  };

  const handleEditStore = (store: InventoryStore) => {
    setCurrentStore(store);
    setIsStoreModalOpen(true);
    handleMenuClose(store.id);
  };

  const handleDeleteStore = (id: string) => {
    setStoreToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };

  const handleConfirmDelete = async () => {
    if (storeToDelete) {
      setIsLoading(true);
      try {
        await inventoryApi.deleteStore(storeToDelete);
        enqueueSnackbar(t('stores.store_deleted'), { variant: 'success' });
        fetchStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        enqueueSnackbar(t('stores.delete_error'), { variant: 'error' });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setStoreToDelete(null);
      }
    }
  };

  const handleSaveStore = async (storeData: any) => {
    setIsLoading(true);
    try {
      if (storeData.id) {
        // Update existing store
        await inventoryApi.updateStore(storeData.id, {
          name: storeData.name,
          location: storeData.location,
          company_id: userInfo?.company_id || storeData.company_id,
          is_active: storeData.is_active,
          address: storeData.address || '',
        });
        enqueueSnackbar(t('stores.store_updated'), { variant: 'success' });
      } else {
        // Add new store - ensure company_id is provided
        if (!userInfo?.company_id) {
          throw new Error(t('stores.company_required'));
        }

        await inventoryApi.createStore({
          name: storeData.name,
          location: storeData.location,
          company_id: userInfo.company_id,
          is_active: 'active',
          address: storeData.address || '',
        });
        enqueueSnackbar(t('stores.store_created'), { variant: 'success' });
      }
      fetchStores();
      setIsStoreModalOpen(false);
    } catch (error: any) {
      console.error('Error saving store:', error);

      // Check for subscription limit error
      if (error.response?.status === 403 && error.response?.data?.error?.includes('Subscription')) {
        const { current_count, max_allowed } = error.response.data;
        enqueueSnackbar(
          t('stores.subscription_limit_reached', {
            current: current_count,
            max: max_allowed,
          }) || `Subscription store limit reached (${current_count}/${max_allowed})`,
          { variant: 'error' }
        );
      } else {
        // Extract error message if available
        const errorMessage =
          error.response?.data?.message || error.response?.data?.error || error.message || t('stores.save_error');

        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('common.dashboard'), url: paths.admin.dashboard },
    { label: t('stores.title'), url: paths.admin.stores },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('stores.title')}
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

      {/* Action Buttons and Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button
            variant="contained"
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewStore}
          >
            {t('stores.add_store')}
          </Button>
        </Box>
        <Box>
          <TextField
            placeholder={t('common.search')}
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <MagnifyingGlassIcon size={20} style={{ marginRight: 8 }} />,
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      {/* Stores List */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('stores.store_name')}</TableCell>
                <TableCell>{t('stores.store_address')}</TableCell>
                <TableCell>{t('stores.store_phone')}</TableCell>
                <TableCell>{t('stores.store_email')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      {searchQuery ? t('common.no_results') : t('stores.no_stores')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.location}</TableCell>
                    <TableCell>{store.phone_number || '-'}</TableCell>
                    <TableCell>{store.email || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={store.is_active === 'active' ? t('common.active') : t('common.inactive')}
                        color={store.is_active === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, store.id)} size="small">
                        <DotsThreeIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElMap[store.id]}
                        open={Boolean(anchorElMap[store.id])}
                        onClose={() => handleMenuClose(store.id)}
                      >
                        <MenuItem onClick={() => handleEditStore(store)}>{t('common.edit')}</MenuItem>
                        <MenuItem onClick={() => handleDeleteStore(store.id)} sx={{ color: 'error.main' }}>
                          {t('common.delete')}
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Store Edit Modal */}
      <StoreEditModal
        open={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        store={currentStore || undefined}
        onSave={handleSaveStore}
      />

      {/* Delete Confirmation Modal */}
      <StoreDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

// Delete confirmation modal component
function StoreDeleteModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const { t } = useTranslation('admin');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('stores.delete_store')}</DialogTitle>
      <DialogContent>
        <Typography>{t('stores.confirm_delete')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
