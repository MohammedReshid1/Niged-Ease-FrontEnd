'use client';

import * as React from 'react';
import { STORE_CHANGED_EVENT, useStore } from '@/providers/store-provider';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi, InventoryStore, Product } from '@/services/api/inventory';
import { PaymentMode, Purchase, Supplier, transactionsApi } from '@/services/api/transactions';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { DotsThree as DotsIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useCurrentUser } from '@/hooks/use-auth';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import PurchaseEditModal from '@/components/admin/purchases/PurchaseEditModal';

export default function PurchasesPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { userInfo } = useCurrentUser();
  const { currentStore } = useStore();

  // State variables
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<string | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    products: [],
    totalAmount: 0,
    subtotal: 0,
    taxAmount: 0,
    tax: '0',
    amount_paid: 0,
    is_credit: false,
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: '',
  });
  const [selectedSupplier, setSelectedSupplier] = React.useState<string>('');
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = React.useState<Purchase | null>(null);

  // Function to format currency
  const formatCurrency = (value: string | number, showSymbol = true) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${showSymbol ? '$' : ''}${numValue.toFixed(2)}`;
  };

  // Calculate total amount including tax
  const calculateTotalWithTax = (subtotal: number, taxPercentage: number) => {
    const taxAmount = (subtotal * taxPercentage) / 100;
    return subtotal + taxAmount;
  };

  // Fetch purchases data
  const fetchPurchases = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      const data = await transactionsApi.getPurchases(currentStore.id);
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      enqueueSnackbar(t('purchases.error_loading'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar, t]);

  // Fetch suppliers data
  const fetchSuppliers = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      const data = await transactionsApi.getSuppliers(currentStore.id);
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      enqueueSnackbar(t('suppliers.error_loading'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar, t]);

  // Fetch products data
  const fetchProducts = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      const data = await inventoryApi.getProducts(currentStore.id);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar(t('products.error_loading'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar, t]);

  // Fetch payment modes data
  const fetchPaymentModes = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      const data = await transactionsApi.getPaymentModes(currentStore.id);
      setPaymentModes(data);
    } catch (error) {
      console.error('Error fetching payment modes:', error);
      enqueueSnackbar(t('payments.error_loading_modes'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar, t]);

  // Fetch currencies data
  const fetchCurrencies = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await companiesApi.getCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      enqueueSnackbar(t('common.error_loading_currencies'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, t]);

  // Fetch all data
  const fetchAllData = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchPurchases(), fetchSuppliers(), fetchProducts(), fetchPaymentModes(), fetchCurrencies()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPurchases, fetchSuppliers, fetchProducts, fetchPaymentModes, fetchCurrencies, currentStore]);

  // Load initial data
  React.useEffect(() => {
    console.log('useEffect: currentStore changed', currentStore);
    if (currentStore) {
      fetchAllData();
    }
  }, [currentStore, fetchAllData]);

  // Listen for store change events
  React.useEffect(() => {
    const handleStoreChange = () => {
      // Reset data when store changes
      setPurchases([]);
      setSelectedPurchaseDetails(null);

      // Fetch new data
      fetchAllData();
    };

    document.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    return () => {
      document.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchAllData]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPurchases(purchases.map((purchase) => purchase.id));
    } else {
      setSelectedPurchases([]);
    }
  };

  const handleSelectOne = (purchaseId: string) => {
    setSelectedPurchases((prevSelected) => {
      if (prevSelected.includes(purchaseId)) {
        return prevSelected.filter((id) => id !== purchaseId);
      } else {
        return [...prevSelected, purchaseId];
      }
    });
  };

  const handleSupplierChange = (event: SelectChangeEvent<string>) => {
    setSelectedSupplier(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, purchaseId: string) => {
    setAnchorElMap({
      ...anchorElMap,
      [purchaseId]: event.currentTarget,
    });
  };

  const handleMenuClose = (purchaseId: string) => {
    setAnchorElMap({
      ...anchorElMap,
      [purchaseId]: null,
    });
  };

  const handleOpenCreateModal = () => {
    // Set default values when creating a new purchase
    console.log('handleOpenCreateModal: Setting up new purchase form');
    setCurrentPurchase({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      products: [],
      totalAmount: 0,
      subtotal: 0,
      taxAmount: 0,
      tax: '0',
      amount_paid: 0,
      is_credit: false,
      company_id: userInfo?.company_id || '',
      store_id: currentStore?.id || '',
      currency_id: currencies.length > 0 ? currencies[0].id : '',
      payment_mode_id: paymentModes.length > 0 ? paymentModes[0].id : '',
    });
    setIsPurchaseModalOpen(true);
  };

  const handleOpenEditModal = async (purchase: Purchase) => {
    console.log('handleOpenEditModal: Opening edit modal for purchase', purchase.id);
    // When editing, we need to fetch purchase items to properly populate the modal
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      // Get purchase items
      const items = await transactionsApi.getPurchaseItems(currentStore.id, purchase.id);
      console.log('Fetched purchase items:', items);

      // Map items to products format expected by the modal
      const purchaseProducts = items.map((item) => {
        const product = products.find((p) => p.id === item.product.id);
        return {
          id: item.product.id,
          name: item.product.name,
          quantity: parseFloat(item.quantity),
          unitPrice: product ? parseFloat(product.purchase_price || '0') : 0,
          subtotal: parseFloat(item.quantity) * (product ? parseFloat(product.purchase_price || '0') : 0),
        };
      });

      // Calculate subtotal
      const subtotal = purchaseProducts.reduce((sum, product) => {
        return sum + product.quantity * product.unitPrice;
      }, 0);

      // Calculate tax amount
      const taxPercentage = purchase.tax ? parseFloat(purchase.tax) : 0;
      const taxAmount = (subtotal * taxPercentage) / 100;

      // Use the amount_paid value for both amount_paid and amount fields
      const amountPaid = parseFloat(purchase.amount_paid || '0');

      // Set current purchase for editing
      setCurrentPurchase({
        id: purchase.id,
        supplier: purchase.supplier.id,
        date: new Date(purchase.created_at).toISOString().split('T')[0],
        products: purchaseProducts,
        totalAmount: parseFloat(purchase.total_amount),
        subtotal: subtotal,
        taxAmount: taxAmount,
        tax: purchase.tax || '0',
        currency_id: purchase.currency.id,
        payment_mode_id: purchase.payment_mode.id,
        is_credit: purchase.is_credit,
        amount_paid: amountPaid, // Set amount_paid
      });

      setIsPurchaseModalOpen(true);
    } catch (error) {
      console.error('Error loading purchase details:', error);
      enqueueSnackbar(t('purchases.error_loading_details'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePurchase = (purchaseId: string) => {
    setPurchaseToDelete(purchaseId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePurchase = async () => {
    if (!currentStore || !purchaseToDelete) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'error' });
      setIsDeleteModalOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await transactionsApi.deletePurchase(currentStore.id, purchaseToDelete);
      enqueueSnackbar(t('purchases.purchase_deleted'), { variant: 'success' });

      // Refresh purchases data
      fetchPurchases();

      // Reset selected purchase details if it was the deleted one
      if (selectedPurchaseDetails?.id === purchaseToDelete) {
        setSelectedPurchaseDetails(null);
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      enqueueSnackbar(t('purchases.error_deleting'), { variant: 'error' });
    } finally {
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
      setIsLoading(false);
    }
  };

  const handleRowClick = (purchase: Purchase) => {
    setSelectedPurchaseDetails((prevSelected) => (prevSelected?.id === purchase.id ? null : purchase));
  };

  const handleCloseDetails = () => {
    setSelectedPurchaseDetails(null);
  };

  const handleSavePurchase = async (purchaseData: any) => {
    console.log('handleSavePurchase: Saving purchase data', purchaseData);

    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      // Log the purchase data to ensure amount_paid is present
      console.log('Purchase data to be saved:', purchaseData);

      // Prepare data for API
      const createOrUpdateData = {
        store_id: currentStore.id,
        supplier_id: purchaseData.supplier,
        total_amount: purchaseData.totalAmount.toString(),
        tax: purchaseData.tax || '0',
        amount_paid: (purchaseData.amount_paid || '0').toString(), // Ensure we use amount_paid from the form
        amount: (purchaseData.amount_paid || '0').toString(), // Set amount equal to amount_paid
        currency_id: purchaseData.currency_id,
        payment_mode_id: purchaseData.payment_mode_id,
        is_credit: purchaseData.is_credit || false,
        items: purchaseData.products.map((product: any) => ({
          product_id: product.id,
          item_purchase_price: product.unitPrice.toString(),
          quantity: product.quantity.toString(),
        })),
      };

      // Log the formatted data to confirm amount_paid is properly formatted
      console.log('Formatted data for API:', createOrUpdateData);

      let purchaseId;

      if (purchaseData.id) {
        // Update existing purchase
        await transactionsApi.updatePurchase(currentStore.id, purchaseData.id, createOrUpdateData);
        purchaseId = purchaseData.id;
        enqueueSnackbar(t('purchases.purchase_updated'), { variant: 'success' });
      } else {
        // Create new purchase
        const newPurchase = await transactionsApi.createPurchase(currentStore.id, createOrUpdateData);
        purchaseId = newPurchase.id;
        enqueueSnackbar(t('purchases.purchase_created'), { variant: 'success' });
      }

      // Create a payable if either:
      // 1. It's a credit purchase OR
      // 2. The amount paid is less than the total amount
      const totalAmount = parseFloat(createOrUpdateData.total_amount);
      const amountPaid = parseFloat(createOrUpdateData.amount_paid);
      const amountDue = totalAmount - amountPaid;

      if ((createOrUpdateData.is_credit || amountDue > 0) && purchaseId) {
        try {
          // Create payable record
          const payableData = {
            store_id: currentStore.id,
            purchase: purchaseId,
            amount: amountDue.toString(),
            currency: createOrUpdateData.currency_id,
          };

          await financialsApi.createPayable(currentStore.id, payableData);
          console.log('Payable created successfully:', purchaseId, 'Amount:', amountDue);
          enqueueSnackbar(t('purchases.payable_created') + `: $${amountDue.toFixed(2)}`, { variant: 'info' });
        } catch (payableError) {
          console.error('Error creating payable:', payableError);
          enqueueSnackbar(t('purchases.payable_error'), { variant: 'warning' });
        }
      }

      // Close modal and refresh data
      setIsPurchaseModalOpen(false);
      fetchPurchases();
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      enqueueSnackbar(t('purchases.error_saving'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.stockManager.dashboard },
    { label: t('purchases.title'), url: paths.stockManager.purchases },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('purchases.title')}
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

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button
            variant="contained"
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleOpenCreateModal}
          >
            {t('purchases.add_purchase')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            displayEmpty
            value={selectedSupplier}
            onChange={handleSupplierChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">{t('purchases.all_suppliers')}</Typography>;
              }
              const supplier = suppliers.find((s) => s.id === selected);
              return supplier ? supplier.name : '';
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t('purchases.all_suppliers')}</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Main content area with Purchases list and details panel */}
      <Grid container spacing={2}>
        {/* Purchases list */}
        <Grid item xs={12} md={selectedPurchaseDetails ? 8 : 12}>
          <Card>
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID/Date</TableCell>
                      <TableCell>{t('purchases.supplier')}</TableCell>
                      <TableCell>{t('purchases.total')}</TableCell>
                      <TableCell>{t('purchases.payment_status')}</TableCell>
                      <TableCell align="center">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : purchases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {t('purchases.no_purchases')}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchases.map((purchase) => {
                        const isSelected = selectedPurchases.includes(purchase.id);
                        const isMenuOpen = Boolean(anchorElMap[purchase.id]);
                        const isDetailSelected = selectedPurchaseDetails?.id === purchase.id;

                        return (
                          <TableRow
                            hover
                            key={purchase.id}
                            selected={isDetailSelected}
                            onClick={() => handleRowClick(purchase)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell>
                              <Typography variant="body2" color="text.primary" gutterBottom>
                                #{purchase.id.slice(-8)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                              </Typography>
                            </TableCell>
                            <TableCell>{purchase.supplier.name}</TableCell>
                            <TableCell>{formatCurrency(purchase.total_amount)}</TableCell>
                            <TableCell>
                              <Chip
                                label={purchase.is_credit ? t('purchases.credit') : t('purchases.paid')}
                                size="small"
                                color={purchase.is_credit ? 'warning' : 'success'}
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="more"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleMenuOpen(event, purchase.id);
                                }}
                              >
                                <DotsIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorElMap[purchase.id]}
                                open={isMenuOpen}
                                onClose={(event: React.MouseEvent<Document, MouseEvent>) => {
                                  event.stopPropagation();
                                  handleMenuClose(purchase.id);
                                }}
                                onClick={(event: React.MouseEvent) => event.stopPropagation()}
                              >
                                <MenuItem
                                  onClick={(event: React.MouseEvent) => {
                                    event.stopPropagation();
                                    handleMenuClose(purchase.id);
                                    handleOpenEditModal(purchase);
                                  }}
                                >
                                  {t('common.edit')}
                                </MenuItem>
                                <MenuItem
                                  onClick={(event: React.MouseEvent) => {
                                    event.stopPropagation();
                                    handleMenuClose(purchase.id);
                                    handleDeletePurchase(purchase.id);
                                  }}
                                >
                                  {t('common.delete')}
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Grid>

        {/* Purchase details panel */}
        {selectedPurchaseDetails && (
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('purchases.purchase_details')}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" onClick={handleCloseDetails}>
                    <ArrowLeftIcon size={20} />
                  </IconButton>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenEditModal(selectedPurchaseDetails)}
                    sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
                  >
                    {t('common.edit')}
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.invoice_id')}
                  </Typography>
                  <Typography variant="body1">#{selectedPurchaseDetails.id.slice(-8)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.purchase_date')}
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedPurchaseDetails.created_at), 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.supplier')}
                  </Typography>
                  <Typography variant="body1">{selectedPurchaseDetails.supplier.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.payment_status')}
                  </Typography>
                  <Chip
                    label={selectedPurchaseDetails.is_credit ? t('purchases.credit') : t('purchases.paid')}
                    size="small"
                    color={selectedPurchaseDetails.is_credit ? 'warning' : 'success'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.payment_method')}
                  </Typography>
                  <Typography variant="body1">{selectedPurchaseDetails.payment_mode.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.total_amount')}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {formatCurrency(selectedPurchaseDetails.total_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.amount_paid')}
                  </Typography>
                  <Typography variant="body1">{formatCurrency(selectedPurchaseDetails.amount_paid || '0')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('purchases.payable_amount')}
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    {formatCurrency(
                      (
                        parseFloat(selectedPurchaseDetails.total_amount) -
                        parseFloat(selectedPurchaseDetails.amount_paid || '0')
                      ).toString()
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Modals */}
      <PurchaseEditModal
        open={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSave={handleSavePurchase}
        purchase={currentPurchase}
        isNew={!currentPurchase.id}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePurchase}
        title={t('purchases.delete_purchase')}
        message={t('purchases.delete_confirmation')}
        isLoading={isLoading}
      />
    </Box>
  );
}
