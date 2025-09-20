'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { SquaresFour as SquaresIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Export as ExportIcon } from '@phosphor-icons/react/dist/ssr/Export';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { paths } from '@/paths';
import { Product, ProductCategory, ProductCreateData, inventoryApi } from '@/services/api/inventory';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ProductEditModal from '@/components/admin/product-manager/ProductEditModal';
import { useCurrentUser } from '@/hooks/use-auth';
import { companiesApi } from '@/services/api/companies';
import { useStore } from '@/providers/store-provider';
import { useTranslation } from 'react-i18next';

export default function ProductsPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductCreateData> & { id?: string; editMode?: boolean }>({
    name: '',
    description: '',
    image: '',
    product_category_id: '',
    product_unit_id: '',
    purchase_price: '',
    sale_price: '',
    color_id: '',
    collection_id: '',
    editMode: false,
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [productUnits, setProductUnits] = useState<any[]>([]);
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  
  // Fetch products and categories
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [productsData, categoriesData, companiesData, unitsData] = await Promise.all([
        inventoryApi.getProducts(currentStore.id),
        inventoryApi.getProductCategories(currentStore.id),
        companiesApi.getCompanies(),
        inventoryApi.getProductUnits(currentStore.id)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setCompanies(companiesData);
      setProductUnits(unitsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar(t('products.loading_products'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore, t]);

  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.product_category.id === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleAddProduct = () => {
    if (!currentStore) {
      enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
      return;
    }
    
    console.log('handleAddProduct called');
    console.log('Categories available:', categories);
    console.log('Product units available:', productUnits);
    
    // Use the selected store
    const storeId = currentStore.id;
    
    // Use the first product unit by default if available
    const defaultUnitId = productUnits.length > 0 ? productUnits[0].id : '';
    
    setCurrentProduct({
      store_id: storeId,
      name: '',
      description: '',
      image: '',
      product_category_id: '',
      product_unit_id: defaultUnitId,
      purchase_price: '',
      sale_price: '',
      color_id: '',
      collection_id: '',
    });
    
    console.log('currentProduct set with store ID:', storeId);
    
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (id: string) => {
    console.log('Edit button clicked for product ID:', id);
    const product = products.find(p => p.id === id);
    console.log('Found product to edit:', product);
    
    if (product) {
      // Use store from product if available, otherwise use currentStore
      const storeId = product.store?.id || currentStore?.id;
      
      if (!storeId) {
        console.error('No store ID available. Please select a store.');
        enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
        return;
      }
      
      // Check if product category exists
      if (!product.product_category?.id) {
        console.error('Product category is missing');
        enqueueSnackbar(t('products.missing_category'), { variant: 'error' });
        return;
      }
      
      // Check if product unit exists
      if (!product.product_unit?.id) {
        console.error('Product unit is missing');
        enqueueSnackbar(t('products.missing_unit'), { variant: 'error' });
        return;
      }
      
      setCurrentProduct({
        id: product.id,
        store_id: storeId,
        name: product.name,
        description: product.description || '',
        image: product.image || '',
        product_category_id: product.product_category.id,
        product_unit_id: product.product_unit.id,
        purchase_price: product.purchase_price || '',
        sale_price: product.sale_price || '',
        color_id: product.color || '',
        collection_id: product.collection || '',
        editMode: true,
      });
      setIsProductModalOpen(true);
    } else {
      console.error('Product not found with ID:', id);
      enqueueSnackbar(t('products.product_not_found'), { variant: 'error' });
    }
  };

  const handleSaveProduct = async (productData: ProductCreateData & { id?: string }) => {
    if (!currentStore) {
      enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
      return;
    }
    
    console.log('handleSaveProduct called with data:', productData);
    
    try {
      if (productData.id) {
        // Update existing product
        console.log('Updating product with ID:', productData.id);
        await inventoryApi.updateProduct(currentStore.id, productData.id, productData);
        enqueueSnackbar(t('products.product_updated'), { variant: 'success' });
      } else {
        // Add new product
        console.log('Creating new product with data:', productData);
        await inventoryApi.createProduct(currentStore.id, productData);
        enqueueSnackbar(t('products.product_created'), { variant: 'success' });
      }
      fetchData();
      setIsProductModalOpen(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.log('Error response:', error.response);
      if (error.response && error.response.data) {
        // Display backend validation errors
        console.log('Backend validation errors:', error.response.data);
        const errorData = error.response.data;
        
        // Format the error message for better readability
        let errorMessage = '';
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([key, value]) => {
            errorMessage += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
          });
        } else {
          errorMessage = String(errorData);
        }
        
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        enqueueSnackbar(t('products.save_error'), { variant: 'error' });
      }
    }
  };

  const handleViewProduct = (id: string) => {
    console.log('View button clicked for product ID:', id);
    const product = products.find(p => p.id === id);
    console.log('Found product to view:', product);
    
    if (product) {
      // Use store from product if available, otherwise use currentStore
      const storeId = product.store?.id || currentStore?.id;
      
      if (!storeId) {
        console.error('No store ID available. Please select a store.');
        enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
        return;
      }
      
      // Check if product category exists
      if (!product.product_category?.id) {
        console.error('Product category is missing');
        enqueueSnackbar(t('products.missing_category'), { variant: 'error' });
        return;
      }
      
      // Check if product unit exists
      if (!product.product_unit?.id) {
        console.error('Product unit is missing');
        enqueueSnackbar(t('products.missing_unit'), { variant: 'error' });
        return;
      }
      
      // Display product details in a temporary way - this would usually navigate to a product detail page
      setCurrentProduct({
        id: product.id,
        store_id: storeId,
        name: product.name,
        description: product.description || '',
        image: product.image || '',
        product_category_id: product.product_category.id,
        product_unit_id: product.product_unit.id,
        purchase_price: product.purchase_price || '',
        sale_price: product.sale_price || '',
        color_id: product.color || '',
        collection_id: product.collection || '',
        editMode: false,
      });
      
      // Show product details in product modal (read-only)
      setIsProductModalOpen(true);
    } else {
      console.error('Product not found with ID:', id);
      enqueueSnackbar(t('products.product_not_found'), { variant: 'error' });
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentStore) {
      enqueueSnackbar(t('dashboard.no_store_message'), { variant: 'warning' });
      return;
    }
    
    if (productToDelete) {
      try {
        await inventoryApi.deleteProduct(currentStore.id, productToDelete);
        enqueueSnackbar(t('products.product_deleted'), { variant: 'success' });
        fetchData();
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        enqueueSnackbar(t('products.delete_error'), { variant: 'error' });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('navigation.dashboard'), url: paths.admin.dashboard },
    { label: t('navigation.product_manager'), url: paths.admin.productManager },
    { label: t('navigation.products'), url: paths.admin.products },
  ];
  
  // Find category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : t('products.unknown_category');
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SquaresIcon size={28} weight="bold" style={{ marginRight: '8px', color: '#0ea5e9' }} />
            <Typography variant="h4">{t('products.title')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
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
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddProduct}
          >
            {t('products.add_product')}
          </Button>
        </Stack>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <OutlinedInput
              placeholder={t('common.search') + '...'}
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-label">{t('products.product_category')}</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={categoryFilter}
                label={t('products.product_category')}
                onChange={handleCategoryChange as any}
              >
                <MenuItem value="">{t('categories.all_categories')}</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="text" 
              fullWidth
              onClick={handleResetFilters}
            >
              {t('common.reset')}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Products Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t('products.product_image')}</TableCell>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('products.product_category')}</TableCell>
                <TableCell>{t('common.description')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>{t('products.loading_products')}</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography>{t('products.no_products')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  
                  return (
                    <TableRow 
                      hover 
                      key={product.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleSelectOne(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.image || '/placeholder-image.jpg'}
                          alt={product.name}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getCategoryName(product.product_category.id)}
                          size="small"
                          sx={{ 
                            bgcolor: '#e0f2fe',
                            color: '#0ea5e9'
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {product.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            size="small"
                            onClick={() => handleViewProduct(product.id)}
                            sx={{ color: 'info.main' }}
                            title={t('common.view')}
                          >
                            <EyeIcon size={20} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditProduct(product.id)}
                            sx={{ color: 'primary.main' }}
                            title={t('common.edit')}
                          >
                            <PencilSimpleIcon size={20} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteConfirmation(product.id)}
                            sx={{ color: 'error.main' }}
                            title={t('common.delete')}
                          >
                            <TrashIcon size={20} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      
      {/* Product Edit Modal */}
      <ProductEditModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
        categories={categories}
        readOnly={Boolean(currentProduct?.id && !currentProduct?.editMode)}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>{t('products.delete_product')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('products.confirm_delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 