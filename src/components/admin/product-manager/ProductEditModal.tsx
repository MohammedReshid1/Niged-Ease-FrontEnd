'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { 
  Product, 
  ProductCategory,
  ProductUnit,
  ProductCreateData, 
  inventoryApi 
} from '@/services/api/inventory';
import { useCurrentUser } from '@/hooks/use-auth';
import { companiesApi } from '@/services/api/companies';
import { clothingsApi } from '@/services/api/clothings';
import { useStore } from '@/providers/store-provider';
import { SimpleUpload } from '@/components/common/simple-upload';

interface ColorData {
  id: string;
  name: string;
}

interface CollectionData {
  id: string;
  name: string;
}

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductCreateData & { id?: string }) => void;
  product: Partial<ProductCreateData> & { id?: string };
  categories: ProductCategory[];
  readOnly?: boolean;
}

export default function ProductEditModal({
  open,
  onClose,
  onSave,
  product,
  categories,
  readOnly = false
}: ProductEditModalProps): React.JSX.Element {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = useState<Partial<ProductCreateData> & { id?: string }>(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [colors, setColors] = useState<ColorData[]>([]);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userInfo } = useCurrentUser();
  const { currentStore } = useStore();
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Fetch required data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (!currentStore) {
          console.error('No store selected');
          return;
        }
        
        const [companiesData, unitsData, colorsData, collectionsData] = await Promise.all([
          companiesApi.getCompanies(),
          inventoryApi.getProductUnits(currentStore.id),
          clothingsApi.getColors(currentStore.id),
          clothingsApi.getCollections(currentStore.id)
        ]);
        setCompanies(companiesData);
        setProductUnits(unitsData);
        setColors(colorsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [currentStore]);
  
  // Reset form data when modal opens with new product data
  useEffect(() => {
    if (open) {
      console.log('Modal opened, userInfo:', userInfo);
      console.log('Selected Store:', currentStore);
      
      if (!currentStore) {
        console.error('No store selected');
        return;
      }
      
      setFormData({
        ...product,
        store_id: currentStore.id,
        purchase_price: product.purchase_price || '',
        sale_price: product.sale_price || ''
      });
      
      setErrors({});
    }
  }, [product, open, userInfo, currentStore]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    console.log('Validating form with data:', formData);
    
    if (!formData.name) {
      console.log('Validation failed: name is missing');
      newErrors.name = t('products.name_required');
    }
    
    if (!formData.product_category_id) {
      console.log('Validation failed: product_category_id is missing');
      newErrors.product_category_id = t('products.category_required');
    }
    
    if (!formData.product_unit_id) {
      console.log('Validation failed: product_unit_id is missing');
      newErrors.product_unit_id = t('products.unit_required');
    }
    
    if (!formData.description) {
      console.log('Validation failed: description is missing');
      newErrors.description = t('products.description_required');
    }
    
    if (!formData.store_id) {
      console.log('Validation failed: store_id is missing');
      newErrors.store_id = t('products.store_required');
    }
    
    // Validate prices if provided
    if (formData.purchase_price && isNaN(Number(formData.purchase_price))) {
      newErrors.purchase_price = t('products.purchase_price_invalid');
    }
    
    if (formData.sale_price && isNaN(Number(formData.sale_price))) {
      newErrors.sale_price = t('products.sale_price_invalid');
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid ? 'PASSED' : 'FAILED', newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    console.log('handleSubmit called, validating form');
    if (validateForm()) {
      console.log('Form validation passed');
      
      if (!currentStore) {
        console.error('No store selected');
        return;
      }
      
      // Prepare data for submission
      const completeData: ProductCreateData & { id?: string } = {
        store_id: formData.store_id || currentStore.id,
        name: formData.name || '',
        description: formData.description || '',
        product_category_id: formData.product_category_id || '',
        product_unit_id: formData.product_unit_id || '',
        image: formData.image || '',
        purchase_price: formData.purchase_price || '',
        sale_price: formData.sale_price || '',
        color_id: formData.color_id || '',
        collection_id: formData.collection_id || ''
      };
      
      if (product.id) {
        completeData.id = product.id;
      }
      
      console.log('Submitting product data:', completeData);
      setIsSubmitting(true);
      onSave(completeData);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {readOnly 
          ? t('products.view_product') 
          : product.id 
            ? t('products.edit_product') 
            : t('products.add_product')
        }
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label={t('products.product_name')}
              type="text"
              fullWidth
              value={formData.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={readOnly}
              InputProps={{
                readOnly: readOnly
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.product_category_id}>
              <InputLabel id="category-select-label">{t('products.product_category')}</InputLabel>
              <Select
                labelId="category-select-label"
                id="product_category_id"
                name="product_category_id"
                value={formData.product_category_id || ''}
                label={t('products.product_category')}
                onChange={handleSelectChange}
                disabled={readOnly}
                inputProps={{
                  readOnly: readOnly
                }}
              >
                <MenuItem value="">{t('products.select_category')}</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.product_category_id && <FormHelperText>{errors.product_category_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.product_unit_id}>
              <InputLabel id="unit-select-label">{t('products.product_unit')}</InputLabel>
              <Select
                labelId="unit-select-label"
                id="product_unit_id"
                name="product_unit_id"
                value={formData.product_unit_id || ''}
                label={t('products.product_unit')}
                onChange={handleSelectChange}
                disabled={readOnly}
                inputProps={{
                  readOnly: readOnly
                }}
              >
                <MenuItem value="">{t('products.select_unit')}</MenuItem>
                {productUnits.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.product_unit_id && <FormHelperText>{errors.product_unit_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.image}>
              <SimpleUpload
                initialImage={formData.image}
                onImageChange={(url) => {
                  setFormData(prev => ({ ...prev, image: url }));
                  // Clear any previous errors
                  if (errors.image) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.image;
                      return newErrors;
                    });
                  }
                }}
                bucketName="app-images"
                folderPath={currentStore?.id || 'default'}
                label={t('products.upload_image')}
                width={180}
                height={180}
                allowRemove={!readOnly}
                readOnly={readOnly}
              />
              {errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="purchase_price"
              label={t('products.product_cost')}
              type="number"
              fullWidth
              value={formData.purchase_price || ''}
              onChange={handleChange}
              error={!!errors.purchase_price}
              helperText={errors.purchase_price}
              disabled={readOnly}
              InputProps={{
                readOnly: readOnly,
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="sale_price"
              label={t('products.product_price')}
              type="number"
              fullWidth
              value={formData.sale_price || ''}
              onChange={handleChange}
              error={!!errors.sale_price}
              helperText={errors.sale_price}
              disabled={readOnly}
              InputProps={{
                readOnly: readOnly,
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="color-select-label">{t('clothing.colors.title')}</InputLabel>
              <Select
                labelId="color-select-label"
                id="color_id"
                name="color_id"
                value={formData.color_id || ''}
                label={t('clothing.colors.title')}
                onChange={handleSelectChange}
                disabled={readOnly}
                inputProps={{
                  readOnly: readOnly
                }}
              >
                <MenuItem value="">{t('products.no_color')}</MenuItem>
                {colors.map(color => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="collection-select-label">{t('clothing.collections.title')}</InputLabel>
              <Select
                labelId="collection-select-label"
                id="collection_id"
                name="collection_id"
                value={formData.collection_id || ''}
                label={t('clothing.collections.title')}
                onChange={handleSelectChange}
                disabled={readOnly}
                inputProps={{
                  readOnly: readOnly
                }}
              >
                <MenuItem value="">{t('products.no_collection')}</MenuItem>
                {collections.map(collection => (
                  <MenuItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label={t('products.product_description')}
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={readOnly}
              InputProps={{
                readOnly: readOnly
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {readOnly ? t('common.close') : t('common.cancel')}
        </Button>
        {!readOnly && (
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {product.id ? t('common.update') : t('common.create')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 