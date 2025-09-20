'use client';

import React from 'react';
import { TopSellingProduct } from '@/services/api/dashboard';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { TFunction } from 'i18next';

interface TopSellingProductsProps {
  products: TopSellingProduct[];
  t: TFunction;
}

export function TopSellingProducts({ products, t }: TopSellingProductsProps) {
  // Ensure we have a valid array of products
  const validProducts = Array.isArray(products) ? products : [];

  return (
    <Card>
      <CardHeader title={t('overview.top_selling_products')} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {validProducts.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.product')}</TableCell>
                <TableCell align="right">{t('overview.quantity')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
                <TableCell align="right">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validProducts.map((product, index) => {
                // Extract data safely
                const id = product.id || product.product_id || `product-${index}`;
                const name = product.name || product.product_name || 'Unknown Product';
                const quantity =
                  typeof product.quantity === 'number'
                    ? product.quantity
                    : typeof product.total_quantity === 'number'
                      ? product.total_quantity
                      : 0;
                const amount =
                  typeof product.amount === 'number'
                    ? product.amount
                    : typeof product.total_sales === 'number'
                      ? product.total_sales
                      : 0;
                const percentage =
                  typeof product.percentage === 'number'
                    ? product.percentage
                    : Math.min(Math.round((amount / 100) * 100), 100) || 0;

                return (
                  <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                    <TableCell align="right">${amount.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Typography variant="body2">{percentage}%</Typography>
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'background.neutral',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                bgcolor: (theme) => {
                                  if (percentage >= 60) return theme.palette.success.main;
                                  if (percentage >= 30) return theme.palette.warning.main;
                                  return theme.palette.error.main;
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('overview.no_data')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
