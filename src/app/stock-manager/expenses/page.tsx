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
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import ExpenseEditModal from '@/components/admin/expenses/ExpenseEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory, ExpenseCreateData, financialsApi } from '@/services/api/financials';
import { transactionsApi, PaymentMode } from '@/services/api/transactions';
import { companiesApi, Currency } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore } from '@/providers/store-provider';
import { SelectChangeEvent } from '@mui/material/Select';
import tokenStorage from '@/utils/token-storage';

// Payment Mode Name Display component
const PaymentModeDisplay = ({ modeId, paymentModes }: { modeId: string, paymentModes: PaymentMode[] }) => {
  const mode = paymentModes.find(m => m.id === modeId);
  return <span>{mode ? mode.name : 'Unknown'}</span>;
};

// Currency Display component
const CurrencyDisplay = ({ currencyId, currencies }: { currencyId: string, currencies: Currency[] }) => {
  const currency = currencies.find(c => c.id === currencyId);
  return <span>{currency ? currency.code : 'Unknown'}</span>;
};

export default function ExpensesPage(): React.JSX.Element {
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
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const { currentStore } = useStore();
  
  // Fetch expenses, categories, and currencies
  const fetchData = useCallback(async () => {
    console.log('Current store status:', { 
      currentStore, 
      userInfo,
      storesInStorage: tokenStorage.getCompanyStores(),
      assignedStore: tokenStorage.getAssignedStore()
    });

    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching data for store: ${currentStore.name} (${currentStore.id})`);
      // Fetch data using the current store ID
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
      
      setExpenses(expensesData);
      setCategories(categoriesData);
      setCurrencies(currenciesData);
      setPaymentModes(modesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load expenses', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar, userInfo]);

  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);

  // Filter expenses based on selected category and search term
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense => {
      // Filter by category if selected
      const categoryMatch = selectedCategory 
        ? expense.expense_category === selectedCategory 
        : true;
      
      // Filter by search term (matching against description)
      const searchMatch = searchTerm
        ? expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      return categoryMatch && searchMatch;
    });
  }, [expenses, selectedCategory, searchTerm]);

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedExpenses(filteredExpenses.map(expense => expense.id));
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

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNewExpense = () => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    setCurrentExpense({
      store_id: currentStore.id,
      expense_category: categories.length > 0 ? categories[0].id : '',
      amount: '',
      description: '',
      currency: currencies.length > 0 ? currencies[0].id : '',
      payment_mode: paymentModes.length > 0 ? paymentModes[0].id : '',
    });
    
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setCurrentExpense({
        id: expense.id,
        store_id: expense.store_id,
        expense_category: expense.expense_category,
        amount: expense.amount,
        description: expense.description,
        currency: expense.currency,
        payment_mode: expense.payment_mode,
      });
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
    if (!currentStore || !expenseToDelete) {
      return;
    }
    
    try {
      await financialsApi.deleteExpense(currentStore.id, expenseToDelete);
      enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
      fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      enqueueSnackbar('Failed to delete expense', { variant: 'error' });
    } finally {
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleSaveExpense = async (expenseData: ExpenseCreateData & { id?: string }) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    try {
      if (expenseData.id) {
        // Update existing expense
        await financialsApi.updateExpense(
          currentStore.id,
          expenseData.id,
          {
            store_id: currentStore.id,
            expense_category: expenseData.expense_category,
            amount: expenseData.amount,
            description: expenseData.description || '',
            currency: expenseData.currency,
            payment_mode: expenseData.payment_mode,
          }
        );
        enqueueSnackbar('Expense updated successfully', { variant: 'success' });
      } else {
        // Create new expense
        await financialsApi.createExpense(
          currentStore.id,
          {
            store_id: currentStore.id,
            expense_category: expenseData.expense_category,
            amount: expenseData.amount,
            description: expenseData.description || '',
            currency: expenseData.currency,
            payment_mode: expenseData.payment_mode,
          }
        );
        enqueueSnackbar('Expense added successfully', { variant: 'success' });
      }
      
      setIsExpenseModalOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving expense:', error);
      enqueueSnackbar('Failed to save expense', { variant: 'error' });
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Expenses', url: paths.stockManager.expenses },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Expenses</Typography>
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
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewExpense}
          >
            Add New Expense
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search expenses..."
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            startAdornment={
              <Box component="span" sx={{ mr: 1 }}>
                <MagnifyingGlassIcon size={20} />
              </Box>
            }
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value={selectedCategory}
            onChange={handleCategoryChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">All Categories</Typography>;
              }
              return getCategoryName(selected);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Expenses Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredExpenses.length > 0 && selectedExpenses.length === filteredExpenses.length}
                    indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < filteredExpenses.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Expense Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                  const isSelected = selectedExpenses.includes(expense.id);
                  const createdDate = new Date(expense.created_at).toLocaleDateString();
                  const category = categories.find(cat => cat.id === expense.expense_category);
                  
                  return (
                    <TableRow key={expense.id} hover selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectOne(expense.id)}
                        />
                      </TableCell>
                      <TableCell>{category?.name || 'Unknown Category'}</TableCell>
                      <TableCell>{parseFloat(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <CurrencyDisplay currencyId={expense.currency} currencies={currencies} />
                      </TableCell>
                      <TableCell>
                        <PaymentModeDisplay modeId={expense.payment_mode} paymentModes={paymentModes} />
                      </TableCell>
                      <TableCell>{createdDate}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditExpense(expense.id)}
                            sx={{ color: '#0ea5e9' }}
                          >
                            <PencilSimpleIcon size={18} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#ef4444' }}
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <TrashIcon size={18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No expenses found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Expense Edit Modal */}
      {isExpenseModalOpen && (
        <ExpenseEditModal
          open={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleSaveExpense}
          expense={currentExpense}
          categories={categories}
          paymentModes={paymentModes}
          currencies={currencies}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </Box>
  );
} 