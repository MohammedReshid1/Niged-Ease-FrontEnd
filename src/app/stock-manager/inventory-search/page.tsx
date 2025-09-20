'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';

interface InventoryItem {
  store_id: string;
  store_name: string;
  store_location: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  store: {
    id: string;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: string;
  };
  product_unit: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  product_category: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  purchase_price: string;
  sale_price: string;
  inventory: InventoryItem[];
  created_at: string;
  updated_at: string;
}

export default function StockManagerInventorySearchPage(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io/inventory/companies/d27c0519-58c3-4ec4-a6af-59dc6666b401/product-search/${encodeURIComponent(searchTerm)}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Inventory Search
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Search products across all stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <MagnifyingGlassIcon size={24} style={{ marginRight: 8, color: '#6B7280' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
              }}
            />
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Card sx={{ mb: 4, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && products.length > 0 && (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="primary">
                      Category: {product.product_category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unit: {product.product_unit.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Purchase Price: {product.purchase_price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sale Price: {product.sale_price}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>
                      Inventory Locations:
                    </Typography>
                    {product.inventory.map((item, index) => (
                      <Box key={item.store_id} sx={{ mt: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                        <Typography variant="body2" color="text.secondary">
                          Store: {item.store_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Location: {item.store_location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && !error && products.length === 0 && searchTerm && (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No products found matching your search criteria
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
} 