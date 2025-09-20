'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from '@/paths';
import { Expense, ExpenseCategory, financialsApi } from '@/services/api/financials';
import { Currency, companiesApi } from '@/services/api/companies';
import { PaymentMode, transactionsApi } from '@/services/api/transactions';
import ExpenseEditModal from '@/components/admin/expenses/ExpenseEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';

export default function ExpensesPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [currentExpense, setCurrentExpense] = useState<any>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected. Please select a store first.', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [
        expensesData, 
        categoriesData, 
        currenciesData, 
        paymentModesData
      ] = await Promise.all([
        financialsApi.getExpenses(currentStore.id),
        financialsApi.getExpenseCategories(currentStore.id),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes(currentStore.id)
      ]);
      
      setExpenses(expensesData);
      setCategories(categoriesData);
      setCurrencies(currenciesData);
      setPaymentModes(paymentModesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      enqueueSnackbar('Failed to load expenses', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar]);

  // Initial load
  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);
  
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

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchData, currentStore]);
  
  // Filter expenses by category and search term
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !selectedCategory || expense.expense_category === selectedCategory;
    const matchesSearch = !searchTerm || 
      (expense.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);
  
  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [id]: null });
  };
  
  // Category filter handlers
  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleCategoryMenuClose();
  };
  
  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Selection handlers
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
  
  // Modal handlers
  const handleAddExpense = () => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
    
    setCurrentExpense({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      store_id: currentStore.id,
      expense_category: defaultCategoryId,
      currency: defaultCurrencyId,
      payment_mode: defaultPaymentModeId
    });
    setIsCreateModalOpen(true);
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setCurrentExpense({
        id: expense.id,
        description: expense.description || '',
        amount: parseFloat(expense.amount),
        date: new Date(expense.created_at).toISOString().split('T')[0],
        store_id: expense.store_id,
        expense_category: expense.expense_category || '',
        currency: expense.currency,
        payment_mode: expense.payment_mode
      });
      setIsCreateModalOpen(true);
      handleMenuClose(id);
    }
  };

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setIsConfirmDeleteOpen(true);
    handleMenuClose(id);
  };

  const handleConfirmDelete = async () => {
    if (!currentStore || !expenseToDelete) {
      return;
    }
    
    setIsLoading(true);
    try {
      await financialsApi.deleteExpense(currentStore.id, expenseToDelete);
      enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
      
      // Remove from selected items if it was selected
      setSelectedExpenses(prev => prev.filter(id => id !== expenseToDelete));
      
      // Refresh expenses list
      fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      enqueueSnackbar('Failed to delete expense', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsConfirmDeleteOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleSaveExpense = async (expenseData: any) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Log what we're getting from the form
      console.log('Expense data from form:', expenseData);
      
      const formattedData = {
        store_id: currentStore.id,
        expense_category: expenseData.expense_category,
        amount: expenseData.amount.toString(),
        description: expenseData.description,
        currency: expenseData.currency,
        payment_mode: expenseData.payment_mode
      };
      
      // Log what we're sending to the API
      console.log('Formatted data for API:', formattedData);
      
      if (expenseData.id) {
        // Update existing expense
        await financialsApi.updateExpense(currentStore.id, expenseData.id, formattedData);
        enqueueSnackbar('Expense updated successfully', { variant: 'success' });
      } else {
        // Create new expense
        await financialsApi.createExpense(currentStore.id, formattedData);
        enqueueSnackbar('Expense created successfully', { variant: 'success' });
      }
      
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving expense:', error);
      enqueueSnackbar('Failed to save expense', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.salesman.dashboard },
    { label: 'Expenses', url: paths.salesman.expenses },
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon />}
          onClick={handleAddExpense}
        >
          Add New Expense
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            }
            sx={{ width: 200 }}
          />
          <Button 
            variant="outlined" 
            onClick={handleCategoryMenuOpen}
            sx={{ minWidth: 180, justifyContent: 'space-between', textTransform: 'none' }}
          >
            {selectedCategory ? 
              categories.find(c => c.id === selectedCategory)?.name || 'All Categories' 
              : 'All Categories'}
          </Button>
          <Menu
            anchorEl={categoryMenuAnchor}
            open={Boolean(categoryMenuAnchor)}
            onClose={handleCategoryMenuClose}
          >
            <MenuItem onClick={() => handleCategorySelect('')}>
              All Categories
            </MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} onClick={() => handleCategorySelect(category.id)}>
                {category.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Summary Card */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Total Expenses</Typography>
              <Typography variant="h5">${totalAmount.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Expenses Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => {
                  const isSelected = selectedExpenses.includes(expense.id);
                  const formattedDate = new Date(expense.created_at).toLocaleDateString();
                  const category = categories.find(c => c.id === expense.expense_category);
                  const currency = currencies.find(c => c.id === expense.currency);
                  
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
                      <TableCell>
                        <Typography variant="subtitle2">{expense.description}</Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>
                        {category && (
                          <Chip 
                            label={category.name} 
                            size="small"
                            sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{currency ? currency.code : ''} {parseFloat(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, expense.id)}>
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchorEl[expense.id]}
                          open={Boolean(menuAnchorEl[expense.id])}
                          onClose={() => handleMenuClose(expense.id)}
                        >
                          <MenuItem onClick={() => handleEditExpense(expense.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeleteClick(expense.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>No expenses found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Expense Edit Modal */}
      <ExpenseEditModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveExpense}
        expense={currentExpense || {}}
        categories={categories}
        paymentModes={paymentModes}
        currencies={currencies}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </Box>
  );
} 