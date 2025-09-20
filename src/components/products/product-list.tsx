'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Grid, 
  IconButton, 
  Pagination, 
  Stack, 
  TextField, 
  Typography 
} from '@mui/material';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { useProducts, useDeleteProduct, Product, ProductParams } from '@/hooks/use-products';

export default function ProductList() {
  const [params, setParams] = useState<ProductParams>({
    page: 1,
    limit: 10,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    data: productsData, 
    isLoading, 
    isError,
    error,
    refetch
  } = useProducts(params);
  
  const deleteProductMutation = useDeleteProduct();
  
  const handleSearch = () => {
    setParams({
      ...params,
      search: searchTerm,
      page: 1, // Reset to first page on new search
    });
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParams({
      ...params,
      page: value,
    });
  };
  
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (deleteId) {
      deleteProductMutation.mutate(deleteId, {
        onSuccess: () => {
          refetch();
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
        <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Products
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ 
              height: { sm: 56 }, 
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              }
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
      
      <Grid container spacing={3}>
        {productsData?.data.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/300x140'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description.substring(0, 100)}
                  {product.description.length > 100 ? '...' : ''}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <IconButton 
                  aria-label="edit"
                  color="primary"
                  onClick={() => console.log('Edit:', product.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDelete(product.id)}
                >
                  <TrashIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {productsData && productsData.total > 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(productsData.total / params.limit!)}
            page={params.page || 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No products found. Try adjusting your search criteria.
          </Typography>
        </Box>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)} 
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained" 
            sx={{ boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)' }}
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 