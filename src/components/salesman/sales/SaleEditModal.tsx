'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/providers/store-provider';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { inventoryApi, InventoryStore, Product } from '@/services/api/inventory';
import { Customer, PaymentMode, transactionsApi } from '@/services/api/transactions';
import { InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '@/hooks/use-auth';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  subtotal: number;
}

interface SaleData {
  id?: string;
  customer_id: string;
  total_amount: number;
  amount_paid: number;
  tax: string;
  subtotal?: number;
  taxAmount?: number;
  is_credit: boolean;
  company_id?: string;
  store_id: string;
  currency_id: string;
  payment_mode_id: string;
  products?: ProductItem[];
  items?: Array<{ product_id: string; quantity: string }>;
}

interface SaleEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SaleData) => void;
  sale?: SaleData;
  isNew?: boolean;
}

export default function SaleEditModal({
  open,
  onClose,
  onSave,
  sale = {
    customer_id: '',
    products: [],
    total_amount: 0,
    amount_paid: 0,
    subtotal: 0,
    taxAmount: 0,
    tax: '0',
    is_credit: false,
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: '',
  },
  isNew = true,
}: SaleEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<SaleData>({
    customer_id: '',
    products: [],
    total_amount: 0,
    amount_paid: 0,
    subtotal: 0,
    taxAmount: 0,
    tax: '0',
    is_credit: false,
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: '',
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [stores, setStores] = React.useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = React.useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);

  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  const { currentStore } = useStore();
  const { t } = useTranslation('admin');

  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          if (!currentStore) {
            console.error('No store selected');
            return;
          }

          const [customersData, productsData, companiesData, storesData, currenciesData] = await Promise.all([
            transactionsApi.getCustomers(currentStore.id),
            inventoryApi.getProducts(currentStore.id),
            companiesApi.getCompanies(),
            inventoryApi.getStores(),
            companiesApi.getCurrencies(),
          ]);

          // Validate customer data has proper UUIDs
          const validCustomers = customersData.filter(
            (customer) => customer.id && typeof customer.id === 'string' && customer.id.trim() !== ''
          );

          if (validCustomers.length === 0) {
            console.warn('No valid customers found with proper IDs');
          }

          setCustomers(validCustomers);
          setProducts(productsData);
          setCompanies(companiesData);
          setStores(storesData);
          setCurrencies(currenciesData);

          // Get payment modes after we have the store ID
          const paymentModesData = await transactionsApi.getPaymentModes(currentStore.id);
          setPaymentModes(paymentModesData);

          // Filter stores by user's company
          if (userInfo?.company_id) {
            const companyStores = storesData.filter(
              (store) => store.company && store.company.id === userInfo.company_id
            );
            setFilteredStores(companyStores);

            // Filter products by user's company through the store
            const companyProducts = productsData.filter(
              (product) => product.store && product.store.company && product.store.company.id === userInfo.company_id
            );
            setFilteredProducts(companyProducts);
          } else {
            setFilteredProducts(productsData);
          }

          // If formData doesn't have IDs, set defaults
          setFormData((prev) => {
            const updated = { ...prev };
            // Always use the user's company
            if (userInfo?.company_id) {
              updated.company_id = userInfo.company_id;
            } else if (!updated.company_id && companiesData.length > 0) {
              updated.company_id = companiesData[0].id;
            }

            // Set default store from filtered stores
            if (!updated.store_id) {
              const availableStores = userInfo?.company_id
                ? storesData.filter((store) => store.company && store.company.id === userInfo.company_id)
                : storesData;

              if (availableStores.length > 0) {
                updated.store_id = availableStores[0].id;
              }
            }

            if (!updated.currency_id && currenciesData.length > 0) {
              updated.currency_id = currenciesData[0].id;
            }
            if (!updated.payment_mode_id && paymentModesData.length > 0) {
              updated.payment_mode_id = paymentModesData[0].id;
            }
            return updated;
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open, userInfo]);

  // Filter stores whenever user company changes
  useEffect(() => {
    if (userInfo?.company_id) {
      // Filter stores by company
      if (stores.length > 0) {
        const companyStores = stores.filter((store) => store.company && store.company.id === userInfo.company_id);
        setFilteredStores(companyStores);
      }

      // Filter products by company through the store
      if (products.length > 0) {
        const companyProducts = products.filter(
          (product) => product.store && product.store.company && product.store.company.id === userInfo.company_id
        );
        setFilteredProducts(companyProducts);
      }
    }
  }, [userInfo, stores, products]);

  // Reset form data when modal opens with new sale data
  React.useEffect(() => {
    if (open) {
      // Ensure products is always an array
      const saleWithProducts = {
        ...sale,
        products: sale.products || [],
      };

      // Always set the company_id to the current user's company_id if available
      if (userInfo?.company_id) {
        saleWithProducts.company_id = userInfo.company_id;
      }

      setFormData(saleWithProducts);
      setFormErrors({});
      calculateTotals(saleWithProducts.products);
    }
  }, [sale, open, userInfo]);

  const calculateTotals = (productItems: ProductItem[]) => {
    // Calculate subtotal
    const subtotal = productItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate tax amount
    const taxRate = parseFloat(formData.tax || '0') / 100;
    const taxAmount = subtotal * taxRate;

    // Calculate total amount
    const totalAmount = subtotal + taxAmount;

    // Update form data with calculated values
    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      total_amount: totalAmount,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle tax field separately for calculations
    if (name === 'tax') {
      const tax = parseFloat(value) || 0;
      setFormData((prev) => {
        const newState = {
          ...prev,
          tax: value,
        };

        // Recalculate tax amount and total if we have products
        if (prev.products && prev.products.length > 0) {
          const taxRate = tax / 100;
          const taxAmount = (prev.subtotal || 0) * taxRate;
          newState.taxAmount = taxAmount;
          newState.total_amount = (prev.subtotal || 0) + taxAmount;
        }

        return newState;
      });
    } else {
      // For other fields, just update the value
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const unitPrice = product.sale_price ? parseFloat(product.sale_price) : 0;

    const newProduct: ProductItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: unitPrice,
      tax: 0,
      subtotal: unitPrice,
    };

    const updatedProducts = [...(formData.products || []), newProduct];
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
    setSelectedProduct('');
  };

  const handleRemoveProduct = (id: string) => {
    const products = formData.products || [];
    const updatedProducts = products.filter((product) => product.id !== id);
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: any) => {
    const products = formData.products || [];
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: parseFloat(value) || 0 };

        // Recalculate subtotal for this product (not including tax, which is calculated at the order level)
        updatedProduct.subtotal = updatedProduct.quantity * updatedProduct.unitPrice;

        return updatedProduct;
      }
      return product;
    });

    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate customer_id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!formData.customer_id) {
      errors.customer_id = t('sales.select_customer');
    } else if (!uuidRegex.test(formData.customer_id)) {
      errors.customer_id = 'Invalid customer ID format. Must be a valid UUID.';
    }

    // Validate currency_id is a valid UUID
    if (!formData.currency_id) {
      errors.currency_id = t('purchases.currency_required');
    } else if (!uuidRegex.test(formData.currency_id)) {
      errors.currency_id = 'Invalid currency ID format. Must be a valid UUID.';
    }

    // Validate payment_mode_id is a valid UUID
    if (!formData.payment_mode_id) {
      errors.payment_mode_id = t('purchases.payment_mode_required');
    } else if (!uuidRegex.test(formData.payment_mode_id)) {
      errors.payment_mode_id = 'Invalid payment mode ID format. Must be a valid UUID.';
    }

    // Validate store_id is a valid UUID
    if (!formData.store_id) {
      errors.store_id = t('products.store_required');
    } else if (!uuidRegex.test(formData.store_id)) {
      errors.store_id = 'Invalid store ID format. Must be a valid UUID.';
    }

    if (!formData.products || formData.products.length === 0) {
      errors.products = t('purchases.products_required');
    }

    // If company is required but we don't have it
    if (!formData.company_id) {
      errors.company_id = 'Company is required. Please refresh the page to get your company information.';
    } else if (!uuidRegex.test(formData.company_id)) {
      errors.company_id = 'Invalid company ID format. Must be a valid UUID.';
    }

    // Validate amount_paid is not negative
    if (formData.amount_paid < 0) {
      errors.amount_paid = t('sales.amount_paid_negative');
    }

    // Validate amount_paid is not greater than total amount
    if (formData.amount_paid > formData.total_amount) {
      errors.amount_paid = t('sales.amount_paid_exceeds_total');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    // Log the form data to see what's being submitted
    console.log('Form data before validation:', formData);

    // Check for empty customer_id first as this is the main issue
    if (!formData.customer_id || formData.customer_id.trim() === '') {
      setFormErrors((prev) => ({
        ...prev,
        customer_id: t('sales.select_customer'),
      }));
      return;
    }

    // Validate all required IDs are valid UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const idFields = {
      customer_id: 'Please select a valid customer',
      company_id: 'Company is required. Please refresh the page to get your company information.',
      store_id: 'Please select a valid store',
      currency_id: 'Please select a valid currency',
      payment_mode_id: 'Please select a valid payment method',
    };

    const errors: Record<string, string> = {};

    // Check each ID field
    for (const [field, message] of Object.entries(idFields)) {
      if (!formData[field as keyof SaleData] || !uuidRegex.test(formData[field as keyof SaleData] as string)) {
        console.error(`Invalid ${field}:`, formData[field as keyof SaleData]);
        errors[field] = message;
      }
    }

    // If we have any errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        ...errors,
      }));
      return;
    }

    if (validateForm()) {
      try {
        // Check if we have products first
        if (!formData.products || formData.products.length === 0) {
          setFormErrors((prev) => ({
            ...prev,
            products: t('purchases.products_required'),
          }));
          return;
        }

        // Transform products array into items array for API
        const items = formData.products.map((product) => ({
          product_id: product.id,
          quantity: product.quantity.toString(),
        }));

        // Create a new object that matches what the API expects
        const apiData: SaleData = {
          store_id: formData.store_id.trim(),
          customer_id: formData.customer_id.trim(),
          currency_id: formData.currency_id.trim(),
          payment_mode_id: formData.payment_mode_id.trim(),
          is_credit: formData.is_credit,
          tax: formData.tax,
          total_amount: formData.total_amount,
          amount_paid: formData.amount_paid || 0,
          items: items,
        };

        console.log('Submitting data to API:', apiData);
        onSave(apiData);
      } catch (error) {
        console.error('Error preparing data for submission:', error);
        setFormErrors((prev) => ({
          ...prev,
          general: 'Error preparing data for submission',
        }));
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isNew ? t('sales.add_sale') : t('sales.edit_sale')}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.customer_id} required>
                <InputLabel id="customer-select-label">{t('sales.sale_customer')}</InputLabel>
                <Select
                  labelId="customer-select-label"
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  label={t('sales.sale_customer')}
                  onChange={handleSelectChange}
                  error={!!formErrors.customer_id}
                >
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      {t('common.no_customers_available')}
                    </MenuItem>
                  )}
                </Select>
                {formErrors.customer_id && (
                  <Typography color="error" variant="caption">
                    {formErrors.customer_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.company_id} disabled>
                <InputLabel id="company-select-label">{t('common.company')}</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  label={t('common.company')}
                  onChange={handleSelectChange}
                  disabled={!!userInfo?.company_id} // Disable when we have a user company
                >
                  {companies.map((company) => (
                    <MenuItem
                      key={company.id}
                      value={company.id}
                      disabled={Boolean(userInfo?.company_id && company.id !== userInfo.company_id)}
                    >
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.company_id && (
                  <Typography color="error" variant="caption">
                    {formErrors.company_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.store_id}>
                <InputLabel id="store-select-label">{t('common.store')}</InputLabel>
                <Select
                  labelId="store-select-label"
                  id="store_id"
                  name="store_id"
                  value={formData.store_id}
                  label={t('common.store')}
                  onChange={handleSelectChange}
                >
                  {filteredStores.length > 0
                    ? filteredStores.map((store) => (
                        <MenuItem key={store.id} value={store.id}>
                          {store.name}
                        </MenuItem>
                      ))
                    : stores.map((store) => (
                        <MenuItem
                          key={store.id}
                          value={store.id}
                          disabled={Boolean(
                            userInfo?.company_id && store.company && store.company.id !== userInfo.company_id
                          )}
                        >
                          {store.name}
                        </MenuItem>
                      ))}
                </Select>
                {formErrors.store_id && (
                  <Typography color="error" variant="caption">
                    {formErrors.store_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.currency_id}>
                <InputLabel id="currency-select-label">{t('common.currency')}</InputLabel>
                <Select
                  labelId="currency-select-label"
                  id="currency_id"
                  name="currency_id"
                  value={formData.currency_id}
                  label={t('common.currency')}
                  onChange={handleSelectChange}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.id} value={currency.id}>
                      {currency.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.currency_id && (
                  <Typography color="error" variant="caption">
                    {formErrors.currency_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!formErrors.payment_mode_id}>
                <InputLabel id="payment-mode-label">{t('sales.payment_method')}</InputLabel>
                <Select
                  labelId="payment-mode-label"
                  id="payment_mode_id"
                  name="payment_mode_id"
                  value={formData.payment_mode_id}
                  label={t('sales.payment_method')}
                  onChange={handleSelectChange}
                >
                  {paymentModes.map((mode) => (
                    <MenuItem key={mode.id} value={mode.id}>
                      {mode.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.payment_mode_id && (
                  <Typography color="error" variant="caption">
                    {formErrors.payment_mode_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                name="tax"
                label={t('sales.tax')}
                type="number"
                value={formData.tax || '0'}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText={t('sales.tax')}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">{t('sales.products')}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="product-select-label">{t('sales.select_product')}</InputLabel>
                    <Select
                      labelId="product-select-label"
                      id="selectedProduct"
                      name="selectedProduct"
                      value={selectedProduct}
                      label={t('sales.select_product')}
                      onChange={(e) => setSelectedProduct(e.target.value as string)}
                      size="small"
                    >
                      {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddProduct}
                    startIcon={<PlusIcon weight="bold" />}
                    sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
                    size="small"
                  >
                    {t('sales.add_item')}
                  </Button>
                </Box>
              </Box>

              {formErrors.products && (
                <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                  {formErrors.products}
                </Typography>
              )}

              {formData.products && formData.products.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('products.product_name')}</TableCell>
                        <TableCell align="right">{t('sales.quantity')}</TableCell>
                        <TableCell align="right">{t('sales.price')}</TableCell>
                        <TableCell align="right">{t('sales.subtotal')}</TableCell>
                        <TableCell align="center">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                              size="small"
                              InputProps={{ inputProps: { min: 1, style: { textAlign: 'right' } } }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={product.unitPrice}
                              onChange={(e) => handleProductChange(product.id, 'unitPrice', e.target.value)}
                              size="small"
                              InputProps={{ inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } } }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="right">${(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleRemoveProduct(product.id)} color="error">
                              <TrashIcon size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Calculate subtotal, tax, and total */}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>{t('sales.subtotal')}:</strong>
                        </TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>
                            $
                            {(
                              formData.subtotal ||
                              formData.products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0)
                            ).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>
                            {t('sales.tax')} ({formData.tax || 0}%):
                          </strong>
                        </TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>
                            $
                            {(
                              formData.taxAmount ||
                              (parseFloat(formData.tax) / 100) *
                                (formData.subtotal ||
                                  formData.products.reduce(
                                    (sum, product) => sum + product.quantity * product.unitPrice,
                                    0
                                  ))
                            ).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>{t('sales.total')}:</strong>
                        </TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>
                            $
                            {(formData.total_amount || (formData.subtotal || 0) + (formData.taxAmount || 0)).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                {t('sales.payment_details')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label={t('sales.subtotal')}
                  value={formData.subtotal?.toFixed(2) || '0.00'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        {currencies.find((c) => c.id === formData.currency_id)?.code || ''}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label={t('common.tax') + ` (${formData.tax}%)`}
                  value={formData.taxAmount?.toFixed(2) || '0.00'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        {currencies.find((c) => c.id === formData.currency_id)?.code || ''}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label={t('sales.total_amount')}
                  value={formData.total_amount?.toFixed(2) || '0.00'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        {currencies.find((c) => c.id === formData.currency_id)?.code || ''}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />

                <TextField
                  name="amount_paid"
                  label={t('sales.amount_paid')}
                  type="number"
                  value={formData.amount_paid || 0}
                  onChange={handleChange}
                  error={!!formErrors.amount_paid}
                  helperText={
                    formErrors.amount_paid ||
                    (formData.amount_paid < formData.total_amount ? t('sales.amount_paid_creates_receivable') : '')
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currencies.find((c) => c.id === formData.currency_id)?.code || ''}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
