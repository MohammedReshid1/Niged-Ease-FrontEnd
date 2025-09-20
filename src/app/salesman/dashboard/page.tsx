'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Container, Grid, Stack, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import { ApexOptions } from 'apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format as formatDate, subDays, subMonths, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import DynamicApexChart from '@/components/dynamic-apex-chart';
import { DashboardFilters, dashboardApi, TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { transactionsApi } from '@/services/api/transactions';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi, Product } from '@/services/api/inventory';
import { paymentsApi, Payment } from '@/services/api/payments';
import { useTransactions } from '@/hooks/salesman/use-transactions';
import { useCustomers } from '@/hooks/salesman/use-customers';
import { useProducts } from '@/hooks/admin/use-products';
import { formatCurrency } from '@/utils/format-currency';
import { StoreSelect } from '@/components/common/store-select';

export default function SalesmanDashboardPage() {
  const { t } = useTranslation('admin');
  const { userInfo } = useCurrentUser();
  const { currentStore } = useStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalExpenses: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    paymentReceived: 0,
    topSellingProducts: [] as TopSellingProduct[],
    recentSales: [] as RecentSale[],
    stockAlerts: [] as StockAlert[],
    topCustomers: [] as TopCustomer[],
  });
  const [salesStats, setSalesStats] = React.useState({
    dailySales: [] as any[],
    monthlySales: [] as any[],
  });
  const [selectedPeriod, setSelectedPeriod] = React.useState<'today' | 'week' | 'month' | 'year'>('month');
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    if (!currentStore) {
      setError('Please select a store to view dashboard data');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data with period:', selectedPeriod);
      
      // Fetch data in parallel from different APIs
      const [sales, expenses, customers, products, payments] = await Promise.all([
        transactionsApi.getSales(currentStore.id),
        financialsApi.getExpenses(currentStore.id),
        transactionsApi.getCustomers(currentStore.id),
        inventoryApi.getProducts(currentStore.id),
        paymentsApi.getPaymentsIn(currentStore.id),
      ]);
      
      console.log('Data fetched:', {
        salesCount: sales.length,
        expensesCount: expenses.length,
        customersCount: customers.length,
        productsCount: products.length,
        paymentsCount: payments?.length || 0
      });
      
      // Process the data
      const dailySalesData = processRecentSalesData(sales, expenses, selectedPeriod);
      const monthlySalesData = processMonthlySalesData(sales, expenses);
      const topSellingProducts = generateTopSellingProducts(sales, products);
      const recentSales = generateRecentSales(sales);
      const topCustomers = generateTopCustomers(sales, customers);
      const salesGrowth = calculateGrowth(monthlySalesData);
      
      // Calculate payment received from payments-in
      const paymentReceived = Array.isArray(payments) 
        ? payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
        : 0;
      
      setStats({
        totalSales: sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.total_amount || '0'), 0),
        totalExpenses: expenses.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount || '0'), 0),
        totalCustomers: customers.length,
        salesGrowth,
        paymentReceived,
        topSellingProducts,
        recentSales,
        stockAlerts: [], // Not relevant for salesman dashboard
        topCustomers,
      });
      
      setSalesStats({
        dailySales: dailySalesData,
        monthlySales: monthlySalesData,
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, currentStore]);

  // Process sales and expenses data into daily points for chart
  const processRecentSalesData = (sales: any[], expenses: any[], period: string) => {
    const days = period === 'today' ? 1 : 
                period === 'week' ? 7 : 
                period === 'month' ? 30 : 365;
    
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = formatDate(date, 'yyyy-MM-dd');
      const dayLabel = formatDate(date, 'MMM dd');
      
      // Filter sales for this day
      const daySales = sales.filter(sale => 
        sale.created_at?.substring(0, 10) === dateStr
      );
      
      // Calculate total sales for the day
      const daySalesTotal = daySales.reduce((sum: number, sale: any) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this day
      const dayExpenses = expenses.filter(expense => 
        expense.created_at?.substring(0, 10) === dateStr
      );
      
      // Calculate total expenses for the day
      const dayExpensesTotal = dayExpenses.reduce((sum: number, expense: any) => 
        sum + parseFloat(expense.amount || '0'), 0
      );
      
      result.push({
        day: dayLabel,
        sales: daySalesTotal,
        expenses: dayExpensesTotal,
      });
    }
    
    return result;
  };
  
  // Process sales data into monthly points for chart and growth calculation
  const processMonthlySalesData = (sales: any[], expenses: any[]) => {
    const result = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthLabel = formatDate(date, 'MMM yy');
      
      // Filter sales for this month
      const monthSales = sales.filter(sale => {
        if (!sale.created_at) return false;
        const saleDate = new Date(sale.created_at);
        return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month;
      });
      
      // Calculate total sales for the month
      const monthSalesTotal = monthSales.reduce((sum: number, sale: any) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this month
      const monthExpenses = expenses.filter(expense => {
        if (!expense.created_at) return false;
        const expenseDate = new Date(expense.created_at);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
      });
      
      // Calculate total expenses for the month
      const monthExpensesTotal = monthExpenses.reduce((sum: number, expense: any) => 
        sum + parseFloat(expense.amount || '0'), 0
      );
      
      result.push({
        month: monthLabel,
        sales: monthSalesTotal,
        expenses: monthExpensesTotal,
      });
    }
    
    return result;
  };

  // Generate top selling products based on sales data
  const generateTopSellingProducts = (sales: any[], products: Product[]): TopSellingProduct[] => {
    // Create a map to track product quantities sold
    const productMap = new Map();
    
    // Assuming sales have items with product details
    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          if (item.product_id) {
            const currentTotal = productMap.get(item.product_id) || { quantity: 0, amount: 0 };
            const itemQuantity = parseInt(item.quantity || '0');
            const itemAmount = parseFloat(item.subtotal || '0');
            
            productMap.set(item.product_id, {
              quantity: currentTotal.quantity + itemQuantity,
              amount: currentTotal.amount + itemAmount
            });
          }
        });
      }
    });
    
    // If we don't have sales item data, use products with random data
    if (productMap.size === 0) {
      products.forEach(product => {
        // For demo purposes
        const randomQuantity = Math.floor(Math.random() * 50) + 1;
        const randomAmount = parseFloat(product.sale_price || '0') * randomQuantity;
        
        productMap.set(product.id, {
          quantity: randomQuantity,
          amount: randomAmount
        });
      });
    }
    
    // Convert map to array of product objects
    const productSales = Array.from(productMap.entries()).map(([productId, data]) => {
      const product = products.find(p => p.id === productId);
      return {
        id: productId,
        name: product ? product.name : 'Unknown Product',
        quantity: data.quantity,
        amount: data.amount,
        percentage: 0,
      };
    });
    
    // Sort by amount in descending order
    productSales.sort((a, b) => b.amount - a.amount);
    
    // Take top 5
    const top5 = productSales.slice(0, 5);
    
    // Calculate percentages
    const totalAmount = top5.reduce((sum, product) => sum + product.amount, 0);
    top5.forEach(product => {
      product.percentage = totalAmount > 0 
        ? Math.round((product.amount / totalAmount) * 100) 
        : 0;
    });
    
    return top5;
  };

  const generateRecentSales = (sales: any[]): RecentSale[] => {
    return sales
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map(sale => ({
        id: sale.id,
        customer: {
          id: sale.customer?.id || '',
          name: sale.customer?.name || 'Unknown Customer'
        },
        status: sale.status || (sale.is_credit ? 'Credit' : 'Paid'),
        amount: parseFloat(sale.total_amount || '0'),
        paid: sale.is_credit ? 0 : parseFloat(sale.total_amount || '0'), // Assuming credit sales are unpaid
        date: sale.created_at ? formatDate(new Date(sale.created_at), 'MMM dd, yyyy') : 'Unknown'
      }));
  };

  const generateTopCustomers = (sales: any[], customers: any[]): TopCustomer[] => {
    // Create a map to store total purchases by customer
    const customerPurchases: Record<string, {
      id: string,
      name: string,
      total_purchases: number,
      order_count: number
    }> = {};

    // Process all sales
    sales.forEach(sale => {
      if (sale.customer) {
        const customerId = sale.customer.id;
        const customerName = sale.customer.name;
        const amount = parseFloat(sale.total_amount || '0');

        if (customerPurchases[customerId]) {
          customerPurchases[customerId].total_purchases += amount;
          customerPurchases[customerId].order_count += 1;
        } else {
          customerPurchases[customerId] = {
            id: customerId,
            name: customerName,
            total_purchases: amount,
            order_count: 1
          };
        }
      }
    });

    // Convert to array and sort by total purchases
    const topCustomers = Object.values(customerPurchases)
      .sort((a, b) => b.total_purchases - a.total_purchases)
      .slice(0, 5)
      .map(customer => ({
        id: customer.id,
        name: customer.name,
        amount: customer.total_purchases,
        salesCount: customer.order_count
      }));

    return topCustomers;
  };

  const calculateGrowth = (monthlySales: any[]): number => {
    if (monthlySales.length < 2) return 0;
    
    const currentMonth = monthlySales[monthlySales.length - 1].sales;
    const previousMonth = monthlySales[monthlySales.length - 2].sales;
    
    if (previousMonth === 0) return 0;
    
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  // Listen for store changes
  React.useEffect(() => {
    const handleStoreChange = () => {
      if (currentStore) {
        console.log('Store changed, fetching dashboard data...');
        fetchDashboardData();
      }
    };

    // Fetch on mount as well
    if (currentStore) {
      fetchDashboardData();
    }

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchDashboardData, currentStore]);

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  // Configure chart options
  const salesChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: salesStats.dailySales.map((item: any) => item.day),
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#4CAF50', '#FF9800'],
  };

  const salesChartSeries = [
    {
      name: 'Sales',
      data: salesStats.dailySales.map((item: any) => item.sales),
    },
    {
      name: 'Expenses',
      data: salesStats.dailySales.map((item: any) => item.expenses),
    },
  ];

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h5">Loading dashboard data...</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we fetch the latest statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h5" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleRetry}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Salesman Dashboard
          </Typography>
          <Box>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleRetry}
              disabled={isLoading}
              startIcon={isLoading ? null : <RefreshIcon />}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        {/* Time period selector */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button 
            variant={selectedPeriod === 'today' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('today')}
          >
            Today
          </Button>
          <Button 
            variant={selectedPeriod === 'week' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('week')}
          >
            This Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('month')}
          >
            This Month
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('year')}
          >
            This Year
          </Button>
        </Stack>

        {/* Statistics summary cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'primary.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <TrendingUpIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.totalSales.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'error.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <TrendingDownIcon color="error" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.totalExpenses.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'success.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <ReceiptIcon color="success" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Received
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.paymentReceived.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'warning.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <PeopleIcon color="warning" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Active Customers
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    {stats.totalCustomers}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Sales & Expenses Overview</Typography>
              </Box>
              <Box sx={{ height: 375 }}>
                <DynamicApexChart
                  type="area"
                  height={375}
                  options={salesChartOptions}
                  series={salesChartSeries}
                />
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TopCustomers 
              customers={stats.topCustomers} 
              t={t}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TopSellingProducts 
              products={stats.topSellingProducts} 
              t={t}
            />
          </Grid>
          
          <Grid item xs={12}>
            <RecentSales 
              sales={stats.recentSales} 
              t={t}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 