'use client';

import React from 'react';
import { TopCustomer } from '@/services/api/dashboard';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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

interface TopCustomersProps {
  customers: TopCustomer[];
  t: TFunction;
}

export function TopCustomers({ customers, t }: TopCustomersProps) {
  // Ensure customers is a valid array
  const validCustomers = Array.isArray(customers) ? customers : [];

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

  // Generate random color based on customer id
  const getAvatarColor = (id: string | undefined) => {
    const colors = ['primary.light', 'secondary.light', 'error.light', 'warning.light', 'info.light', 'success.light'];
    // Use the customer ID to pick a color (just for consistent coloring)
    // Safe check for null/undefined id
    if (!id) {
      return colors[0]; // Default to first color if id is missing
    }
    const colorIndex = id.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Card>
      <CardHeader title={t('overview.top_customers')} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {validCustomers.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.customer')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
                <TableCell align="right">{t('overview.sales')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validCustomers.map((customer, index) => (
                <TableRow
                  key={customer.id || `customer-${index}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getAvatarColor(customer.id),
                          fontSize: '0.875rem',
                        }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name || t('common.unnamed_customer', 'Unnamed Customer')}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      ${(customer.amount || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {customer.salesCount || 0} {(customer.salesCount || 0) === 1 ? 'sale' : 'sales'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
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
