'use client';

import React from 'react';
import { StockAlert } from '@/services/api/dashboard';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { TFunction } from 'i18next';

interface StockAlertsProps {
  alerts: StockAlert[];
  t: TFunction;
}

export function StockAlerts({ alerts, t }: StockAlertsProps) {
  // Ensure we have a valid array of alerts
  const validAlerts = Array.isArray(alerts) ? alerts : [];

  // Get stock status based on quantity vs alertThreshold
  const getStockStatus = (quantity: number, alertThreshold: number) => {
    const ratio = quantity / alertThreshold;

    if (quantity === 0) {
      return {
        label: t('overview.out_of_stock'),
        color: 'error' as const,
      };
    } else if (ratio <= 0.5) {
      return {
        label: t('overview.low_stock'),
        color: 'warning' as const,
      };
    } else {
      return {
        label: t('overview.in_stock'),
        color: 'success' as const,
      };
    }
  };

  return (
    <Card>
      <CardHeader title={t('overview.stock_alerts')} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {validAlerts.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.product')}</TableCell>
                <TableCell align="right">{t('overview.quantity')}</TableCell>
                <TableCell align="right">{t('overview.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validAlerts.map((alert, index) => {
                // Safely extract values
                const alertId = alert.id || `alert-${index}`;
                const productName = alert.product?.name || 'Unknown Product';
                const quantity = typeof alert.quantity === 'number' ? alert.quantity : 0;
                const alertThreshold = typeof alert.alertThreshold === 'number' ? alert.alertThreshold : 10;

                const status = getStockStatus(quantity, alertThreshold);

                return (
                  <TableRow key={alertId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {productName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{quantity} pcs</TableCell>
                    <TableCell align="right">
                      <Chip label={status.label} size="small" color={status.color} variant="filled" />
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
