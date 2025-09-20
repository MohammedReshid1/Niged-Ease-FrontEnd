'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { format } from 'date-fns';
import { Expense, ExpenseCategory } from '@/services/api/financials';
import { PaymentMode } from '@/services/api/transactions';
import { Currency } from '@/services/api/companies';
import { useTranslation } from 'react-i18next';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  paymentModes: PaymentMode[];
  currencies: Currency[];
  selectedExpenses: string[];
  isLoading: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({
  expenses,
  categories,
  paymentModes,
  currencies,
  selectedExpenses,
  isLoading,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete
}: ExpenseTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation('admin');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {t('expenses.no_expenses')}
        </Typography>
      </Box>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getPaymentModeName = (modeId: string) => {
    const mode = paymentModes.find(m => m.id === modeId);
    return mode ? mode.name : 'Unknown';
  };

  const getCurrencyCode = (currencyId: string) => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.code : 'Unknown';
  };

  // Mobile card view rendering for each expense
  const renderMobileView = () => {
    return (
      <Stack spacing={2}>
        {expenses.map((expense) => {
          const isSelected = selectedExpenses.includes(expense.id);
          
          return (
            <Card 
              key={expense.id} 
              sx={{ 
                p: 2, 
                borderLeft: isSelected ? '4px solid var(--mui-palette-primary-main)' : '4px solid transparent',
                boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'var(--mui-shadows-1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectOne(expense.id)}
                    size="small"
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {format(new Date(expense.created_at), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => onEdit(expense.id)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <PencilSimpleIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(expense.id)}
                    size="small"
                  >
                    <TrashSimpleIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('expenses.expense_category')}</Typography>
                  <Typography variant="body2">{getCategoryName(expense.expense_category)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('expenses.expense_amount')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {expense.amount} {getCurrencyCode(expense.currency)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">{t('expenses.expense_description')}</Typography>
                <Typography variant="body2">{expense.description}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">{t('expenses.expense_payment_mode')}</Typography>
                <Chip 
                  label={getPaymentModeName(expense.payment_mode)} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.75rem',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider' 
                  }} 
                />
              </Box>
            </Card>
          );
        })}
      </Stack>
    );
  };

  // Desktop table view
  const renderTableView = () => {
    return (
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                  indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>{t('expenses.expense_date')}</TableCell>
              <TableCell>{t('expenses.expense_category')}</TableCell>
              <TableCell>{t('expenses.expense_description')}</TableCell>
              <TableCell>{t('expenses.expense_amount')}</TableCell>
              <TableCell>{t('expenses.expense_payment_mode')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => {
              const isSelected = selectedExpenses.includes(expense.id);
              
              return (
                <TableRow 
                  hover 
                  key={expense.id} 
                  selected={isSelected}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(99, 102, 241, 0.08)'
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.12)'
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onSelectOne(expense.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(expense.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{getCategoryName(expense.expense_category)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {expense.amount} {getCurrencyCode(expense.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getPaymentModeName(expense.payment_mode)} 
                      size="small" 
                      sx={{ fontSize: '0.75rem' }} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => onEdit(expense.id)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <PencilSimpleIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(expense.id)}
                      size="small"
                      color="error"
                    >
                      <TrashSimpleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return isMobile ? renderMobileView() : renderTableView();
} 