'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { House as HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { ShoppingBag as ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';

import ProductList from '@/components/products/product-list';

export default function ProductsPage() {
  return (
    <>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          bgcolor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--AppBar-zIndex)',
          mb: 3
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ minHeight: 64, px: 3 }}
        >
          <div>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Products
            </Typography>
            <Breadcrumbs separator="›" sx={{ mt: 1 }}>
              <Link
                color="text.secondary"
                href="/admin/dashboard"
                style={{ alignItems: 'center', display: 'inline-flex', textDecoration: 'none' }}
              >
                <HouseIcon
                  style={{ marginRight: 4 }}
                  fontSize="var(--icon-fontSize-sm)"
                />
                Dashboard
              </Link>
              <Typography
                color="text.primary"
                sx={{ alignItems: 'center', display: 'inline-flex' }}
              >
                <ShoppingBagIcon
                  style={{ marginRight: 4 }}
                  fontSize="var(--icon-fontSize-sm)"
                />
                Products
              </Typography>
            </Breadcrumbs>
          </div>
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <ProductList />
      </Box>
    </>
  );
}