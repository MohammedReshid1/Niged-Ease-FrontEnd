'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { STORE_CHANGED_EVENT, useStore } from '@/providers/store-provider';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import {
  Customer,
  PaymentMode,
  Sale,
  SaleCreateData,
  SaleUpdateData,
  transactionsApi,
} from '@/services/api/transactions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
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
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import SaleEditModal from '@/components/admin/sales/SaleEditModal';

export default function SalesPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSales, setSelectedSales] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isSaleModalOpen, setIsSaleModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<any>(null);
  const [saleToDelete, setSaleToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editModalLoading, setEditModalLoading] = React.useState(false);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [stores, setStores] = React.useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = React.useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [selectedSaleDetails, setSelectedSaleDetails] = React.useState<Sale | null>(null);

  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();

  // Fetch sales and customers
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Fetching data for store: ${currentStore.name} (${currentStore.id})`);
      const [salesData, customersData, companiesData, storesData, currenciesData, paymentModesData] = await Promise.all(
        [
          transactionsApi.getSales(currentStore.id),
          transactionsApi.getCustomers(currentStore.id),
          companiesApi.getCompanies(),
          inventoryApi.getStores(),
          companiesApi.getCurrencies(),
          transactionsApi.getPaymentModes(currentStore.id),
        ]
      );

      setSales(salesData);
      setCustomers(customersData);
      setCompanies(companiesData);
      setStores(storesData);
      setCurrencies(currenciesData);
      setPaymentModes(paymentModesData);

      // Filter stores based on user's company
      if (userInfo?.company_id) {
        const storesForCompany = storesData.filter(
          (store) => store.company && store.company.id === userInfo.company_id
        );
        setFilteredStores(storesForCompany);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar(t('common.error'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore, userInfo, t]);

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

  // Filter stores when userInfo changes
  useEffect(() => {
    if (userInfo?.company_id && stores.length > 0) {
      const storesForCompany = stores.filter((store) => store.company && store.company.id === userInfo.company_id);
      setFilteredStores(storesForCompany);
    }
  }, [userInfo, stores]);

  // Filter sales by selected customer
  const filteredSales = selectedCustomer ? sales.filter((sale) => sale.customer.id === selectedCustomer) : sales;

  // Filter sales by current store
  const storeFilteredSales = currentStore
    ? filteredSales.filter((sale) => {
        console.log(
          `Checking sale customer store_id: ${sale.customer.store_id} against current store: ${currentStore.id}`
        );
        return sale.customer.store_id === currentStore.id;
      })
    : filteredSales;

  console.log(`Original sales count: ${sales.length}`);
  console.log(`After customer filter: ${filteredSales.length}`);
  console.log(`After store filter: ${storeFilteredSales.length}`);

  // Further filter sales by user's company if available
  const companySales = userInfo?.company_id ? storeFilteredSales : storeFilteredSales;

  // Calculate total amounts
  const totalAmount = companySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const totalPaid = 0; // Not available in the API directly
  const totalDue = totalAmount - totalPaid;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSales(companySales.map((sale) => sale.id));
    } else {
      setSelectedSales([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSales.includes(id)) {
      setSelectedSales(selectedSales.filter((saleId) => saleId !== id));
    } else {
      setSelectedSales([...selectedSales, id]);
    }
  };

  const handleCustomerChange = (event: SelectChangeEvent) => {
    setSelectedCustomer(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleRowClick = (sale: Sale) => {
    setSelectedSaleDetails(sale);
  };

  const handleAddNewSale = () => {
    // Use the current user's company ID instead of the first company
    const userCompanyId = userInfo?.company_id || '';
    // Only get stores from user's company
    const defaultStoreId = filteredStores.length > 0 ? filteredStores[0].id : '';
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';

    setCurrentSale({
      customer: '',
      totalAmount: 0,
      tax: '0',
      is_credit: false,
      company_id: userCompanyId,
      store_id: defaultStoreId,
      currency_id: defaultCurrencyId,
      payment_mode_id: defaultPaymentModeId,
    });
    setIsSaleModalOpen(true);
  };

  const handleEditSale = async (saleId: string) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    try {
      setEditModalLoading(true);
      const saleToEdit = await transactionsApi.getSale(currentStore.id, saleId);
      const saleItems = await transactionsApi.getSaleItems(currentStore.id, saleId);

      // Print the original sale items data
      console.log('Original sale items data:', saleItems);

      // Convert sale items to the format expected by the form
      const products = await Promise.all(
        saleItems.map(async (item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.item_sale_price || '0'), // Include item_sale_price
          unitPrice: parseFloat(item.item_sale_price || '0'), // Also set as unitPrice for compatibility
          subtotal: parseInt(item.quantity, 10) * parseFloat(item.item_sale_price || '0'), // Calculate subtotal
        }))
      );

      // Set the current sale for editing
      setCurrentSale({
        id: saleToEdit.id,
        date: new Date(saleToEdit.created_at).toISOString().split('T')[0],
        customer: saleToEdit.customer.id,
        status: saleToEdit.status,
        products: products,
        totalAmount: parseFloat(saleToEdit.total_amount),
        tax: saleToEdit.tax || '0', // Load tax value from sale data
        paidAmount: 0, // This needs to be fetched from somewhere
        dueAmount: parseFloat(saleToEdit.total_amount), // This needs to be calculated
        paymentStatus: saleToEdit.status,
        store_id: saleToEdit.store.id,
        currency_id: saleToEdit.currency.id,
        payment_mode_id: saleToEdit.payment_mode.id,
        is_credit: saleToEdit.is_credit,
      });

      setIsSaleModalOpen(true);
    } catch (error) {
      console.error('Error fetching sale details:', error);
      enqueueSnackbar(t('sales.error_loading_sale'), { variant: 'error' });
    } finally {
      setEditModalLoading(false);
    }
  };

  const handleDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!saleToDelete || !currentStore) {
      enqueueSnackbar(t('sales.no_sale_selected'), { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await transactionsApi.deleteSale(currentStore.id, saleToDelete);

      // Remove the deleted sale from the state
      setSales(sales.filter((sale) => sale.id !== saleToDelete));

      enqueueSnackbar(t('sales.sale_deleted'), { variant: 'success' });
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
    } catch (error) {
      console.error('Error deleting sale:', error);
      enqueueSnackbar(t('sales.error_deleting'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSale = async (saleData: any) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      // Log the incoming data for debugging
      console.log('Original sale data:', JSON.stringify(saleData, null, 2));

      // Safely convert values and handle undefined
      const safeToString = (value: any) => {
        if (value === undefined || value === null) {
          return '0';
        }
        return value.toString();
      };

      const formattedData = {
        store_id: currentStore.id,
        customer_id: saleData.customer_id || saleData.customer,
        total_amount: safeToString(saleData.amount_paid || saleData.amount_paid),
        tax: safeToString(saleData.tax || '0'),
        amount_paid: safeToString(saleData.amount_paid || 0),
        currency_id: saleData.currency_id,
        payment_mode_id: saleData.payment_mode_id,
        is_credit: Boolean(saleData.is_credit),
        items: [],
      };

      console.log('Sale data products/items:', JSON.stringify(saleData.products || saleData.items, null, 2));
      // Check if we have items or products
      if (Array.isArray(saleData.items) && saleData.items.length > 0) {
        formattedData.items = saleData.items;
      } else if (Array.isArray(saleData.products) && saleData.products.length > 0) {
        formattedData.items = saleData.products.map((product: any) => {
          // Log each product being processed
          console.log('Processing product:', product);

          // Use price, unitPrice, or default to 0
          const itemSalePrice = product.price || product.unitPrice || 0;
          console.log(`Using price: ${itemSalePrice} for product ${product.id}`);

          return {
            product_id: product.product_id || product.id,
            quantity: safeToString(product.quantity),
            item_sale_price: safeToString(itemSalePrice),
          };
        });
      }

      console.log('Formatted data for API:', JSON.stringify(formattedData, null, 2));

      // Check if items array is empty before sending to API
      if (!formattedData.items || formattedData.items.length === 0) {
        enqueueSnackbar(t('sales.error_no_items'), { variant: 'error' });
        setIsLoading(false);
        return;
      }

      // Debug each item to ensure it has required fields
      console.log('Items to be submitted:', JSON.stringify(formattedData.items, null, 2));

      // Validate each item has product_id and quantity
      const invalidItems = formattedData.items.filter((item: any) => !item.product_id || !item.quantity);

      if (invalidItems.length > 0) {
        console.error('Invalid items found:', invalidItems);
        enqueueSnackbar(t('sales.invalid_items'), { variant: 'error' });
        setIsLoading(false);
        return;
      }

      let saleId;

      if (saleData.id) {
        // Update existing sale
        await transactionsApi.updateSale(currentStore.id, saleData.id, formattedData);
        saleId = saleData.id;
        enqueueSnackbar(t('sales.sale_updated'), { variant: 'success' });
      } else {
        // Create new sale
        const newSale = await transactionsApi.createSale(currentStore.id, formattedData);
        saleId = newSale.id;
        enqueueSnackbar(t('sales.sale_created'), { variant: 'success' });
      }

      // Create a receivable if either:
      // 1. It's a credit sale OR
      // 2. The amount paid is less than the total amount
      const totalAmount = parseFloat(safeToString(saleData.total_amount || saleData.totalAmount));
      const amountPaid = parseFloat(safeToString(saleData.amount_paid || 0));
      const amountDue = totalAmount - amountPaid;

      if ((saleData.is_credit || amountDue > 0) && saleId) {
        try {
          // Create receivable record
          const receivableData = {
            store_id: currentStore.id,
            sale: saleId,
            amount: safeToString(amountDue),
            currency: saleData.currency_id,
          };

          await financialsApi.createReceivable(currentStore.id, receivableData);
          console.log('Receivable created successfully:', saleId, 'Amount:', amountDue);
          enqueueSnackbar(t('sales.receivable_created'), { variant: 'info' });
        } catch (receivableError) {
          console.error('Error creating receivable:', receivableError);
          enqueueSnackbar(t('sales.receivable_error'), { variant: 'warning' });
        }
      }

      setIsSaleModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving sale:', error);
      enqueueSnackbar(t('sales.error_saving'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      if (!currentStore) {
        console.error('No store selected');
        enqueueSnackbar('Please select a store', { variant: 'error' });
        return null;
      }

      const response = await inventoryApi.getProduct(currentStore.id, productId);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.admin.dashboard },
    { label: t('sales.title'), url: paths.admin.sales },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('sales.title')}
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
            onClick={handleAddNewSale}
          >
            {t('sales.add_sale')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder={t('sales.search_invoice')}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value={selectedCustomer}
            onChange={handleCustomerChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">{t('sales.select_customer')}</Typography>;
              }
              const customer = customers.find((c) => c.id === selected);
              return customer ? customer.name : '';
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t('sales.all_customers')}</MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
          <Box
            sx={{
              display: 'flex',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder={t('sales.start_date')}
              style={{
                border: 'none',
                padding: '8px 12px',
                outline: 'none',
                width: 80,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box>
            <input
              type="text"
              placeholder={t('sales.end_date')}
              style={{
                border: 'none',
                padding: '8px 12px',
                outline: 'none',
                width: 80,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Sales Table or Sale Details */}
      {selectedSaleDetails ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('sales.sale_details')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('sales.invoice_number')}
                </Typography>
                <Typography variant="body1">{selectedSaleDetails.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('sales.sale_date')}
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedSaleDetails.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('sales.sale_status')}
                </Typography>
                <Chip
                  label={selectedSaleDetails.status}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedSaleDetails.status === 'PARTIALLY_PAID'
                        ? 'warning.100'
                        : selectedSaleDetails.status === 'PAID'
                          ? 'success.100'
                          : selectedSaleDetails.status === 'UNPAID'
                            ? 'error.100'
                            : 'primary.100',
                    color:
                      selectedSaleDetails.status === 'PARTIALLY_PAID'
                        ? 'warning.main'
                        : selectedSaleDetails.status === 'PAID'
                          ? 'success.main'
                          : selectedSaleDetails.status === 'UNPAID'
                            ? 'error.main'
                            : 'primary.main',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('sales.sale_customer')}
                </Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('common.contact_info')}
                </Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.email}</Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('sales.total')}
                </Typography>
                <Typography variant="body1">${parseFloat(selectedSaleDetails.total_amount).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => setSelectedSaleDetails(null)} sx={{ mr: 1 }}>
              {t('common.back')}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleEditSale(selectedSaleDetails.id)}
              sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
              {t('common.edit')}
            </Button>
          </Box>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedSales.length === companySales.length} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>{t('sales.invoice_number')}</TableCell>
                <TableCell>{t('sales.sale_date')}</TableCell>
                <TableCell>{t('sales.sale_customer')}</TableCell>
                <TableCell>{t('sales.sale_status')}</TableCell>
                <TableCell>{t('sales.total')}</TableCell>
                <TableCell>{t('sales.paid')}</TableCell>
                <TableCell>{t('common.due_amount')}</TableCell>
                <TableCell>{t('sales.payment_status')}</TableCell>
                <TableCell>{t('common.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>{t('sales.loading_sales')}</Typography>
                  </TableCell>
                </TableRow>
              ) : companySales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>{t('sales.no_sales')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companySales.map((sale) => {
                  const isSelected = selectedSales.includes(sale.id);
                  const isMenuOpen = Boolean(anchorElMap[sale.id]);
                  const formattedDate = new Date(sale.created_at)
                    .toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    .replace(/\//g, '-');

                  // Determine display status based on Sale properties
                  const displayStatus = sale.is_credit ? 'Credit' : 'Confirmed';
                  const displayPaymentStatus = sale.status;

                  return (
                    <TableRow
                      hover
                      key={sale.id}
                      selected={isSelected}
                      onClick={() => handleRowClick(sale)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onChange={() => handleSelectOne(sale.id)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{sale.id.substring(0, 8)}</Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{sale.customer.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={displayStatus}
                          size="small"
                          sx={{
                            bgcolor: displayStatus === 'Credit' ? 'warning.100' : 'success.100',
                            color: displayStatus === 'Credit' ? 'warning.main' : 'success.main',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>${parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>${parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={displayPaymentStatus}
                          size="small"
                          sx={{
                            bgcolor:
                              displayPaymentStatus === 'PARTIALLY_PAID'
                                ? 'warning.100'
                                : displayPaymentStatus === 'PAID'
                                  ? 'success.100'
                                  : displayPaymentStatus === 'UNPAID'
                                    ? 'error.100'
                                    : 'primary.100',
                            color:
                              displayPaymentStatus === 'PARTIALLY_PAID'
                                ? 'warning.main'
                                : displayPaymentStatus === 'PAID'
                                  ? 'success.main'
                                  : displayPaymentStatus === 'UNPAID'
                                    ? 'error.main'
                                    : 'primary.main',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={(event) => handleMenuOpen(event, sale.id)}>
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[sale.id]}
                          open={isMenuOpen}
                          onClose={() => handleMenuClose(sale.id)}
                        >
                          <MenuItem onClick={() => handleEditSale(sale.id)}>{t('common.edit')}</MenuItem>
                          <MenuItem onClick={() => handleDeleteSale(sale.id)}>{t('common.delete')}</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Modals */}
      {isSaleModalOpen && currentSale && (
        <SaleEditModal
          open={isSaleModalOpen}
          onClose={() => setIsSaleModalOpen(false)}
          onSave={handleSaveSale}
          sale={currentSale}
          isNew={!currentSale.id}
        />
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmation')}
        message={t('sales.confirm_delete')}
      />
    </Box>
  );
}
