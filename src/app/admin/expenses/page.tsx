'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { paths } from '@/paths';
import ExpenseEditModal from '@/components/admin/expenses/ExpenseEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory, ExpenseCreateData, financialsApi } from '@/services/api/financials';
import { transactionsApi, PaymentMode } from '@/services/api/transactions';
import { companiesApi, Currency, Company } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';
import { Card as MuiCard, Container, Tab, Tabs } from '@mui/material';
import Header from '@/components/Header';
import { getClaimValue } from '@/utils/jwtUtils';
import { FilterComponent } from '@/components/advanced-filter/FilterComponent';
import { SearchBar } from '@/components/interface/SearchBar';
import { ExpenseAdd } from './add';
import ExpenseTable from './ExpenseTable';
import { Stack as MuiStack } from '@mui/system';
import { useStore } from '@/providers/store-provider';
import tokenStorage from '@/utils/token-storage';
import { useTranslation } from 'react-i18next';

// Payment Mode Name Display component
const PaymentModeDisplay = ({ modeId, paymentModes }: { modeId: string, paymentModes: PaymentMode[] }) => {
  const mode = paymentModes.find(m => m.id === modeId);
  return <span>{mode ? mode.name : 'Unknown'}</span>;
};

// Currency Display component - optimized to use currencies from props
const CurrencyDisplay = ({ currencyId, currencies }: { currencyId: string, currencies: Currency[] }) => {
  const currency = currencies.find(c => c.id === currencyId);
  return <span>{currency ? currency.code : 'Unknown'}</span>;
};

export default function ExpensesPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const [selectedExpenses, setSelectedExpenses] = React.useState<string[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentExpense, setCurrentExpense] = React.useState<Partial<ExpenseCreateData> & { id?: string }>({
    expense_category: '',
    amount: '',
    description: '',
    currency: '',
    payment_mode: '',
  });
  const [expenseToDelete, setExpenseToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [categories, setCategories] = React.useState<ExpenseCategory[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [currentStoreId, setCurrentStoreId] = React.useState<string>('');
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const { currentStore } = useStore();
  
  // Fetch expenses, categories, and currencies
  const fetchData = useCallback(async () => {
    console.log('Current store status (admin expenses):', { 
      currentStore, 
      userInfo,
      storesInStorage: tokenStorage.getCompanyStores(),
      assignedStore: tokenStorage.getAssignedStore()
    });

    setIsLoading(true);
    try {
      if (!currentStore) {
        // Try to use the store provider
        console.log('No current store from store provider, falling back to company stores');
        
        // First get companies to find the user's company
        const companiesData = await companiesApi.getCompanies();
        setCompanies(companiesData);
        
        const companyId = userInfo?.company_id || (companiesData.length > 0 ? companiesData[0].id : '');
        
        if (!companyId) {
          enqueueSnackbar('No company found', { variant: 'error' });
          setIsLoading(false);
          return;
        }
        
        // Get stores for the company
        const stores = await companiesApi.getStores(companyId);
        const companyStores = stores.filter(store => 
          store.company && store.company.id === companyId
        );
        
        if (companyStores.length > 0) {
          const storeId = companyStores[0].id;
          setCurrentStoreId(storeId);
          console.log(`Using first company store: ${companyStores[0].name} (${storeId})`);
          
          // Now get all data using the store ID
          const [expensesData, categoriesData, currenciesData, modesData] = await Promise.all([
            financialsApi.getExpenses(storeId),
            financialsApi.getExpenseCategories(storeId),
            companiesApi.getCurrencies(),
            transactionsApi.getPaymentModes(storeId)
          ]);
          
          console.log('Received data:', { 
            expenses: expensesData.length, 
            categories: categoriesData.length, 
            currencies: currenciesData.length, 
            modes: modesData.length 
          });
          
          // Filter expenses by store_id to ensure we only show expenses for the current store
          const filteredExpenses = expensesData.filter(expense => expense.store_id === storeId);
          console.log(`Filtered expenses by store_id: ${filteredExpenses.length} of ${expensesData.length}`);
          
          setExpenses(filteredExpenses);
          setCategories(categoriesData);
          setCurrencies(currenciesData);
          setPaymentModes(modesData);
        } else {
          console.warn('No stores found for company:', companyId);
          enqueueSnackbar('No stores found for your company', { variant: 'warning' });
        }
      } else {
        // Use the current store from the store provider
        setCurrentStoreId(currentStore.id);
        console.log(`Using current store from provider: ${currentStore.name} (${currentStore.id})`);
        
        // Now get all data using the store ID
        const [expensesData, categoriesData, currenciesData, modesData] = await Promise.all([
          financialsApi.getExpenses(currentStore.id),
          financialsApi.getExpenseCategories(currentStore.id),
          companiesApi.getCurrencies(),
          transactionsApi.getPaymentModes(currentStore.id)
        ]);
        
        console.log('Received data:', { 
          expenses: expensesData.length, 
          categories: categoriesData.length, 
          currencies: currenciesData.length, 
          modes: modesData.length 
        });
        
        // Filter expenses by store_id to ensure we only show expenses for the current store
        const filteredExpenses = expensesData.filter(expense => expense.store_id === currentStore.id);
        console.log(`Filtered expenses by store_id: ${filteredExpenses.length} of ${expensesData.length}`);
        
        setExpenses(filteredExpenses);
        setCategories(categoriesData);
        setCurrencies(currenciesData);
        setPaymentModes(modesData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load expenses', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, userInfo, currentStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for store change events
  useEffect(() => {
    const handleStoreChange = () => {
      // Force refetch data when store changes
      if (currentStore) {
        // Small delay to ensure store context has been updated
        setTimeout(() => {
          fetchData();
        }, 100);
      }
    };

    window.addEventListener('store-selection-changed', handleStoreChange);
    
    return () => {
      window.removeEventListener('store-selection-changed', handleStoreChange);
    };
  }, [fetchData, currentStore]);

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedExpenses(expenses.map(expense => expense.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(expenseId => expenseId !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const handleAddNewExpense = () => {
    console.log('handleAddNewExpense called');
    console.log('Currencies available:', currencies);
    
    // Prefer currentStore from store provider, fall back to currentStoreId
    const storeId = currentStore?.id || currentStoreId;
    
    if (!storeId) {
      console.log('No store ID available');
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'error' });
      return;
    }
    
    // Set default values for the new expense
    setCurrentExpense({
      store_id: storeId,
      expense_category: categories.length > 0 ? categories[0].id : '',
      amount: '',
      description: '',
      currency: currencies.length > 0 ? currencies[0].id : '', 
      payment_mode: paymentModes.length > 0 ? paymentModes[0].id : '',
    });
    
    console.log('currentExpense set with store ID:', storeId);
    
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setCurrentExpense(expense);
      setIsExpenseModalOpen(true);
    } else {
      enqueueSnackbar('Expense not found', { variant: 'error' });
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Prefer currentStore from store provider, fall back to currentStoreId
    const storeId = currentStore?.id || currentStoreId;
    
    if (expenseToDelete && storeId) {
      try {
        await financialsApi.deleteExpense(storeId, expenseToDelete);
        enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
        fetchData();
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
      } catch (error: any) {
        console.error('Error deleting expense:', error);
        enqueueSnackbar('Failed to delete expense', { variant: 'error' });
      }
    }
  };

  const handleSaveExpense = async (expenseData: ExpenseCreateData & { id?: string }) => {
    console.log('handleSaveExpense called with data:', expenseData);
    try {
      // Prefer currentStore from store provider, fall back to currentStoreId
      const storeId = currentStore?.id || currentStoreId;
      
      if (!storeId) {
        throw new Error('Store ID is not available');
      }
      
      if (expenseData.id) {
        // Update existing expense
        console.log('Updating expense with ID:', expenseData.id);
        await financialsApi.updateExpense(storeId, expenseData.id, expenseData);
        enqueueSnackbar('Expense updated successfully', { variant: 'success' });
      } else {
        // Add new expense
        console.log('Creating new expense with data:', expenseData);
        await financialsApi.createExpense(storeId, expenseData);
        enqueueSnackbar('Expense added successfully', { variant: 'success' });
      }
      fetchData();
      setIsExpenseModalOpen(false);
    } catch (error: any) {
      console.error('Error saving expense:', error);
      console.log('Error response:', error.response);
      if (error.response && error.response.data) {
        // Display backend validation errors
        console.log('Backend validation errors:', error.response.data);
        enqueueSnackbar(JSON.stringify(error.response.data), { variant: 'error' });
      } else {
        enqueueSnackbar('Failed to save expense', { variant: 'error' });
      }
    }
  };

  // Find category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.admin.dashboard },
    { label: t('navigation.expenses'), url: paths.admin.expenses },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>{t('expenses.title')}</Typography>
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

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewExpense}
            disabled={isLoading || currencies.length === 0 || (!currentStore?.id && !currentStoreId)}
          >
            {t('expenses.add_expense')}
          </Button>
          <Button
            variant="outlined"
            href={paths.admin.expenseCategories}
          >
            {t('expenses.categories.title')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">{t('expenses.categories.all_categories')}</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t('expenses.categories.all_categories')}</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
          <Box sx={{ 
            display: 'flex', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden',
            alignItems: 'center',
          }}>
            <input 
              type="text" 
              placeholder={t('expenses.start_date')}
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 100
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box>
            <input 
              type="text" 
              placeholder={t('expenses.end_date')}
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 100
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Expenses Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={expenses.length > 0 && selectedExpenses.length === expenses.length}
                  indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>{t('expenses.expense_category')}</TableCell>
              <TableCell>{t('expenses.expense_amount')}</TableCell>
              <TableCell>{t('expenses.expense_date')}</TableCell>
              <TableCell>{t('expenses.expense_description')}</TableCell>
              <TableCell>{t('expenses.expense_currency')}</TableCell>
              <TableCell>{t('expenses.expense_payment_mode')}</TableCell>
              <TableCell>{t('common.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>{t('expenses.loading_expenses')}</Typography>
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography>{t('expenses.no_expenses')}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => {
                const isSelected = selectedExpenses.includes(expense.id);
                const formattedDate = new Date(expense.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-');
                
                return (
                  <TableRow 
                    hover 
                    key={expense.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleSelectOne(expense.id)}
                      />
                    </TableCell>
                    <TableCell>{getCategoryName(expense.expense_category)}</TableCell>
                    <TableCell>${parseFloat(expense.amount).toLocaleString()}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell><CurrencyDisplay currencyId={expense.currency} currencies={currencies} /></TableCell>
                    <TableCell><PaymentModeDisplay modeId={expense.payment_mode} paymentModes={paymentModes} /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditExpense(expense.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          <PencilSimpleIcon size={20} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <TrashIcon size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                {t('common.total')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toLocaleString()}</TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={1} color="primary" />
        </Box>
      </Card>

      {/* Expense Edit Modal */}
      <ExpenseEditModal
        open={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expense={currentExpense}
        categories={categories}
        paymentModes={paymentModes}
        currencies={currencies}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.confirmation')}
        message={t('expenses.confirm_delete')}
      />
    </Box>
  );
} 