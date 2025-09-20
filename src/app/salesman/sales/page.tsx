'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { STORE_CHANGED_EVENT, useStore } from '@/providers/store-provider';
import { companiesApi, Currency } from '@/services/api/companies';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi, Product } from '@/services/api/inventory';
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
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useSnackbar } from 'notistack';

import { paths } from '@/paths';
import { useCurrentUser } from '@/hooks/use-auth';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import SaleEditModal from '@/components/salesman/sales/SaleEditModal';

export default function SalesPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedSales, setSelectedSales] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isSaleModalOpen, setIsSaleModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<any>(null);
  const [saleToDelete, setSaleToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<Sale | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  // Get current user's company
  const { userInfo } = useCurrentUser();

  // Fetch products data
  const fetchProducts = React.useCallback(async () => {
    if (!currentStore) return;

    setIsLoading(true);
    try {
      const data = await inventoryApi.getProducts(currentStore.id);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar('Error loading products', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar]);

  // Modify fetchData to include products
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Fetching data for store: ${currentStore.name} (${currentStore.id})`);
      const [salesData, customersData, currenciesData, paymentModesData, productsData] = await Promise.all([
        transactionsApi.getSales(currentStore.id),
        transactionsApi.getCustomers(currentStore.id),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes(currentStore.id),
        inventoryApi.getProducts(currentStore.id),
      ]);

      setSales(salesData);
      setCustomers(customersData);
      setCurrencies(currenciesData);
      setPaymentModes(paymentModesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Error loading data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore]);

  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);

  // Listen for store change events
  useEffect(() => {
    const handleStoreChange = () => {
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
  }, [fetchData, currentStore]);

  // Filter sales by selected customer
  const filteredSales = selectedCustomer ? sales.filter((sale) => sale.customer.id === selectedCustomer) : sales;

  // Calculate total amounts
  const totalAmount = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const totalPaid = 0; // Not available in the API directly
  const totalDue = totalAmount - totalPaid;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedSaleDetails(null); // Reset selected sale details when changing tabs
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSales(filteredSales.map((sale) => sale.id));
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
    setTabValue(3); // Switch to a new tab for viewing sale details
  };

  const handleAddNewSale = () => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }

    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';

    setCurrentSale({
      date: new Date().toISOString().split('T')[0],
      customer_id: '',
      status: 'Ordered',
      products: [],
      total_amount: 0,
      subtotal: 0,
      taxAmount: 0,
      tax: '0',
      amount_paid: 0,
      is_credit: false,
      company_id: userInfo?.company_id || '',
      store_id: currentStore.id,
      currency_id: defaultCurrencyId,
      payment_mode_id: defaultPaymentModeId,
    });
    setIsSaleModalOpen(true);
  };

  const handleEditSale = async (saleId: string) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'error' });
      return;
    }

    setEditModalLoading(true);
    try {
      // Get sale details
      const sale = sales.find((s) => s.id === saleId);
      if (!sale) {
        enqueueSnackbar('Sale not found', { variant: 'error' });
        return;
      }

      // Get sale items
      const items = await transactionsApi.getSaleItems(currentStore.id, saleId);

      // Map items to products format expected by the modal
      const saleProducts = items.map((item) => {
        return {
          id: item.product.id,
          name: item.product.name,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.product.sale_price || '0'),
          subtotal: parseFloat(item.quantity) * parseFloat(item.product.sale_price || '0'),
          tax: 0,
        };
      });

      // Calculate subtotal
      const subtotal = saleProducts.reduce((sum, product) => {
        return sum + product.quantity * product.unitPrice;
      }, 0);

      // Calculate tax amount
      const taxPercentage = sale.tax ? parseFloat(sale.tax) : 0;
      const taxAmount = (subtotal * taxPercentage) / 100;

      // Use the amount_paid value
      const amountPaid = parseFloat(sale.amount_paid || '0');

      // Set current sale for editing
      setCurrentSale({
        id: sale.id,
        customer_id: sale.customer.id,
        date: new Date(sale.created_at).toISOString().split('T')[0],
        products: saleProducts,
        total_amount: parseFloat(sale.total_amount),
        subtotal: subtotal,
        taxAmount: taxAmount,
        tax: sale.tax || '0',
        currency_id: sale.currency.id,
        payment_mode_id: sale.payment_mode.id,
        is_credit: sale.is_credit,
        amount_paid: amountPaid,
        status: sale.status || 'Ordered',
      });

      setIsSaleModalOpen(true);
    } catch (error) {
      console.error('Error loading sale details:', error);
      enqueueSnackbar('Error loading sale details', { variant: 'error' });
    } finally {
      setEditModalLoading(false);
    }
  };

  const handleDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };

  const handleConfirmDelete = async () => {
    if (!currentStore || !saleToDelete) {
      return;
    }

    setIsLoading(true);
    try {
      await transactionsApi.deleteSale(currentStore.id, saleToDelete);
      enqueueSnackbar('Sale deleted successfully', { variant: 'success' });

      // Remove from selected items if it was selected
      setSelectedSales((prev) => prev.filter((id) => id !== saleToDelete));

      // Refresh sales list
      fetchData();
    } catch (error) {
      console.error('Error deleting sale:', error);
      enqueueSnackbar('Failed to delete sale', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
    }
  };

  const handleSaveSale = async (saleData: any) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      // Log the sale data to ensure amount_paid is present
      console.log('Sale data to be saved:', saleData);

      // Helper function to safely convert values to strings
      const safeToString = (value: any) => {
        if (value === null || value === undefined) return '0';
        if (typeof value === 'string') return value;
        return value.toString();
      };

      // Prepare data for API
      const formattedData = {
        store_id: currentStore.id,
        customer_id: saleData.customer_id,
        total_amount: safeToString(saleData.total_amount),
        tax: safeToString(saleData.tax || '0'),
        amount_paid: safeToString(saleData.amount_paid || '0'),
        currency_id: saleData.currency_id,
        payment_mode_id: saleData.payment_mode_id,
        is_credit: saleData.is_credit || false,
        status: saleData.status,
        items: [],
      };

      // Only add items if products exist and are in an array
      if (Array.isArray(saleData.products) && saleData.products.length > 0) {
        formattedData.items = saleData.products.map((item: any) => {
          const product = item.product_id ? item : item;
          return {
            product_id: product.product_id || product.id,
            quantity: safeToString(product.quantity),
            item_sale_price: safeToString(product.price || product.unitPrice || 0),
          };
        });
      }

      console.log('Formatted data for API:', formattedData);

      // Check if items array is empty before sending to API
      if (!formattedData.items || formattedData.items.length === 0) {
        enqueueSnackbar('Sale must include at least one product', { variant: 'error' });
        setIsLoading(false);
        return;
      }

      let saleId;

      if (saleData.id) {
        // Update existing sale
        await transactionsApi.updateSale(currentStore.id, saleData.id, formattedData);
        saleId = saleData.id;
        enqueueSnackbar('Sale updated successfully', { variant: 'success' });
      } else {
        // Create new sale
        const newSale = await transactionsApi.createSale(currentStore.id, formattedData);
        saleId = newSale.id;
        enqueueSnackbar('Sale created successfully', { variant: 'success' });
      }

      // Create a receivable if either:
      // 1. It's a credit sale OR
      // 2. The amount paid is less than the total amount
      const totalAmount = parseFloat(formattedData.total_amount);
      const amountPaid = parseFloat(formattedData.amount_paid);
      const amountDue = totalAmount - amountPaid;

      if ((formattedData.is_credit || amountDue > 0) && saleId) {
        try {
          // Create receivable record
          const receivableData = {
            store_id: currentStore.id,
            sale: saleId,
            amount: amountDue.toString(),
            currency: formattedData.currency_id,
          };

          await financialsApi.createReceivable(currentStore.id, receivableData);
          console.log('Receivable created successfully:', saleId, 'Amount:', amountDue);
          enqueueSnackbar('Receivable created successfully', { variant: 'info' });
        } catch (receivableError) {
          console.error('Error creating receivable:', receivableError);
          enqueueSnackbar('Failed to create receivable', { variant: 'warning' });
        }
      }

      setIsSaleModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving sale:', error);
      enqueueSnackbar('Failed to save sale', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.salesman.dashboard },
    { label: 'Sales', url: paths.salesman.sales },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Sales
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
        <Button variant="contained" color="primary" startIcon={<PlusIcon />} onClick={handleAddNewSale}>
          Add New Sale
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            value={selectedCustomer}
            onChange={handleCustomerChange}
            displayEmpty
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: 'text.secondary' }}>All Customers</Typography>;
              }

              const customer = customers.find((c) => c.id === selected);
              return customer ? customer.name : 'All Customers';
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Customers</MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total Amount
              </Typography>
              <Typography variant="h5">${totalAmount.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total Paid
              </Typography>
              <Typography variant="h5">${totalPaid.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total Due
              </Typography>
              <Typography variant="h5">${totalDue.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Sales" />
        <Tab label="Unpaid" />
        <Tab label="Paid" />
        {selectedSaleDetails && <Tab label={`Sale ${selectedSaleDetails.id.substring(0, 8)}`} />}
      </Tabs>

      {/* Sales Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredSales.length > 0 && selectedSales.length === filteredSales.length}
                    indeterminate={selectedSales.length > 0 && selectedSales.length < filteredSales.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Sale ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const isSelected = selectedSales.includes(sale.id);
                  const formattedDate = new Date(sale.created_at).toLocaleDateString();

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
                          label={sale.status}
                          size="small"
                          sx={{
                            bgcolor: sale.is_credit ? 'warning.100' : 'success.100',
                            color: sale.is_credit ? 'warning.main' : 'success.main',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>${parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, sale.id);
                          }}
                        >
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[sale.id]}
                          open={Boolean(anchorElMap[sale.id])}
                          onClose={() => handleMenuClose(sale.id)}
                        >
                          <MenuItem onClick={() => handleEditSale(sale.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeleteSale(sale.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No sales found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <SaleEditModal
          open={isSaleModalOpen}
          onClose={() => setIsSaleModalOpen(false)}
          onSave={handleSaveSale}
          sale={currentSale}
          isNew={!currentSale.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This action cannot be undone."
      />
    </Box>
  );
}
