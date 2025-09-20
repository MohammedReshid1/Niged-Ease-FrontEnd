'use client';

import React from 'react';
import { RecentSale } from '@/services/api/dashboard';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { TFunction } from 'i18next';

interface RecentSalesProps {
  sales: RecentSale[];
  t: TFunction;
}

export function RecentSales({ sales, t }: RecentSalesProps) {
  // Ensure we have a valid array of sales
  const validSales = Array.isArray(sales) ? sales : [];

  // Log the sales data for debugging
  console.log('Recent sales component data:', validSales);

  // Generate initials from customer name
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'N/A';

    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Status chip style based on status
  const getStatusChipProps = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    let variant: 'filled' | 'outlined' = 'filled';

    switch (status.toLowerCase()) {
      case 'confirmed':
        color = 'success';
        break;
      case 'shipping':
      case 'processing':
        color = 'info';
        break;
      case 'credit':
        color = 'warning';
        break;
      case 'paid':
        color = 'success';
        break;
      default:
        color = 'default';
    }

    return { color, variant };
  };

  return (
    <Card>
      <CardHeader title={t('overview.recent_sales')} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {validSales.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.order')}</TableCell>
                <TableCell>{t('overview.customer')}</TableCell>
                <TableCell>{t('overview.date')}</TableCell>
                <TableCell>{t('overview.status')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validSales.map((sale, index) => {
                // Safely extract values
                const saleId = sale.id || `sale-${index}`;
                const customerName = sale.customer?.name || sale.customer_name || 'Unknown Customer';
                const saleDate = sale.date || sale.transaction_date || 'N/A';
                const saleStatus = sale.status || sale.payment_status || 'Unknown';
                const saleAmount =
                  typeof sale.amount === 'number'
                    ? sale.amount
                    : typeof sale.total_amount === 'number'
                      ? sale.total_amount
                      : 0;
                const salePaid =
                  typeof sale.paid === 'number'
                    ? sale.paid
                    : typeof sale.amount_paid === 'number'
                      ? sale.amount_paid
                      : saleAmount;

                const statusProps = getStatusChipProps(saleStatus);

                return (
                  <TableRow key={saleId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {saleId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
                          {getInitials(customerName)}
                        </Avatar>
                        <Typography variant="body2">{customerName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{saleDate}</TableCell>
                    <TableCell>
                      <Chip label={saleStatus} size="small" color={statusProps.color} variant={statusProps.variant} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${saleAmount.toFixed(2)}
                      </Typography>
                      {salePaid < saleAmount && (
                        <Typography variant="caption" color="text.secondary">
                          {t('overview.paid')}: ${salePaid.toFixed(2)}
                        </Typography>
                      )}
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
