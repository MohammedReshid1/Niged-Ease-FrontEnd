'use client';

import React, { useEffect, useState } from 'react';
import { STORE_CHANGED_EVENT, useStore } from '@/providers/store-provider';
import { RecentSale, StockAlert, TopCustomer, TopSellingProduct } from '@/services/api/dashboard';
import { financialsApi } from '@/services/api/financials';
import { Inventory, inventoryApi, Product } from '@/services/api/inventory';
import { transactionsApi } from '@/services/api/transactions';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Import the @phosphor-icons
import { Storefront } from '@phosphor-icons/react/dist/ssr/Storefront';
import { ApexOptions } from 'apexcharts';
import { format, format as formatDate, subDays, subMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { DashboardPeriod, useDashboardData } from '@/hooks/admin/use-dashboard';
import { ReportType, useAvailableReports, useReport } from '@/hooks/admin/use-reports';
import { useCurrentUser } from '@/hooks/use-auth';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import DynamicApexChart from '@/components/dynamic-apex-chart';

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation('admin');
  const { userInfo } = useCurrentUser();
  const { currentStore, stores } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>('month');
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  // Debug information
  const isDevMode = process.env.NODE_ENV === 'development';

  // Use the new TanStack Query hook
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useDashboardData(currentStore?.id, selectedPeriod);

  // For debugging - log translation key values
  useEffect(() => {
    if (isDevMode) {
      console.log('Current language:', i18n.language);
      console.log('Translation key values:');
      console.log('dashboard.overview =', t('dashboard.overview'));
      console.log('dashboard.stats.total_sales =', t('dashboard.stats.total_sales'));
      console.log('dashboard.stats.total_expenses =', t('dashboard.stats.total_expenses'));
      console.log('dashboard.stats.payment_received =', t('dashboard.stats.payment_received'));
      console.log('dashboard.stats.total_customers =', t('dashboard.stats.total_customers'));
      console.log('dashboard.charts.sales_vs_expenses =', t('dashboard.charts.sales_vs_expenses'));

      // Check if the admin namespace is loaded
      console.log('Is admin namespace loaded:', i18n.hasResourceBundle(i18n.language, 'admin'));
      console.log('Available namespaces:', Object.keys(i18n.services.resourceStore.data[i18n.language] || {}));

      // Check if specific keys exist in the resources
      const adminResources = i18n.getResourceBundle(i18n.language, 'admin');
      console.log('Admin resources:', adminResources);

      if (adminResources) {
        console.log('Has dashboard key:', 'dashboard' in adminResources);
        if ('dashboard' in adminResources) {
          const dashboardRes = adminResources.dashboard;
          console.log('Dashboard resources:', dashboardRes);
          console.log('Has overview key:', 'overview' in dashboardRes);
          console.log('Has stats key:', 'stats' in dashboardRes);
        }
      }

      // Try to manually force loading the namespace if it's not loaded
      if (!i18n.hasResourceBundle(i18n.language, 'admin')) {
        console.log('Attempting to load admin namespace...');
        i18n
          .loadNamespaces('admin')
          .then(() => {
            console.log('Admin namespace loaded successfully');
          })
          .catch((err) => {
            console.error('Error loading admin namespace:', err);
          });
      }
    }
  }, [t, i18n, isDevMode]);

  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    // First try to get the translation directly
    const result = t(key);

    // If we're using a non-English language, show more detailed debugging
    if (isDevMode && i18n.language !== 'en') {
      console.log(`Translating [${key}] in language [${i18n.language}]:`, result);
      console.log('Has resource bundle:', i18n.hasResourceBundle(i18n.language, 'admin'));

      // Try to inspect the resource directly
      const resourceBundle = i18n.getResourceBundle(i18n.language, 'admin');
      if (resourceBundle) {
        // Get nested keys
        const keys = key.split('.');
        let value = resourceBundle;
        for (const k of keys) {
          value = value?.[k];
          if (!value) break;
        }
        console.log('Direct resource lookup:', value);
      }
    }

    // If the result is the same as the key, it means translation failed
    if (result === key) {
      return fallback;
    }

    return result;
  };

  const handlePeriodChange = (period: DashboardPeriod) => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    refetch();
  };

  const toggleDebug = () => {
    setIsDebugVisible(!isDebugVisible);
  };

  // Create the options for the charts
  const dailySalesChartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: ['#2979ff', '#ff9800'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#eeeeee',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'square',
    },
    theme: {
      mode: 'light',
    },
    tooltip: {
      theme: 'light',
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      // Ensure we have valid categories for the chart
      categories: dashboardData?.dailySales?.length
        ? dashboardData.dailySales.map((item: any) => item?.day || '')
        : Array(7)
            .fill(0)
            .map((_, i) => formatDate(subDays(new Date(), 6 - i), 'yyyy-MM-dd')),
      labels: {
        style: {
          colors: '#637381',
        },
      },
    },
    yaxis: [
      {
        labels: {
          formatter: (value: number) => `$${value.toFixed(0)}`,
          style: {
            colors: '#637381',
          },
        },
      },
    ],
  };

  // Create the chart series based on the data
  const dailySalesChartSeries = [
    {
      name: safeTranslate('dashboard.charts.sales', 'Sales'),
      // Add default empty array if dailySales is missing
      data: dashboardData?.dailySales?.length
        ? dashboardData.dailySales.map((item: any) => item?.sales || 0)
        : Array(7).fill(0),
    },
    {
      name: safeTranslate('dashboard.charts.expenses', 'Expenses'),
      // Add default empty array if dailySales is missing
      data: dashboardData?.dailySales?.length
        ? dashboardData.dailySales.map((item: any) => item?.expenses || 0)
        : Array(7).fill(0),
    },
  ];

  // Debug logging for chart data
  console.log('Chart data - dailySales:', dashboardData?.dailySales);
  console.log('Chart series - sales data:', dailySalesChartSeries[0].data);
  console.log('Chart series - expenses data:', dailySalesChartSeries[1].data);

  // Ensure both series have the same length
  if (dailySalesChartSeries[0].data.length !== dailySalesChartSeries[1].data.length) {
    console.warn('Sales and expenses data arrays have different lengths');
    // Make both arrays the same length using the longer one
    const maxLength = Math.max(dailySalesChartSeries[0].data.length, dailySalesChartSeries[1].data.length);
    dailySalesChartSeries[0].data = dailySalesChartSeries[0].data.concat(
      Array(maxLength - dailySalesChartSeries[0].data.length).fill(0)
    );
    dailySalesChartSeries[1].data = dailySalesChartSeries[1].data.concat(
      Array(maxLength - dailySalesChartSeries[1].data.length).fill(0)
    );
  }

  // Ensure the category array length matches the data array length
  if (dailySalesChartOptions.xaxis?.categories?.length !== dailySalesChartSeries[0].data.length) {
    console.warn('Categories and data arrays have different lengths');
    // Adjust categories to match data length
    const dataLength = dailySalesChartSeries[0].data.length;
    const today = new Date();
    if (dailySalesChartOptions.xaxis) {
      dailySalesChartOptions.xaxis.categories = Array(dataLength)
        .fill(0)
        .map((_, i) => formatDate(subDays(today, dataLength - 1 - i), 'yyyy-MM-dd'));
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {safeTranslate('dashboard.loading', 'Loading dashboard data...')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <RefreshIcon
                fontSize="large"
                sx={{
                  animation: 'spin 2s linear infinite',
                  color: 'primary.main',
                  fontSize: 48,
                }}
              />
            </Box>
          </Box>
        </Box>
        <style jsx global>{`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom color="error">
            {safeTranslate('dashboard.error', 'Error Loading Dashboard')}
          </Typography>
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8f8', color: 'error.main' }}>
            <Typography variant="body1" paragraph>
              {error instanceof Error
                ? error.message
                : safeTranslate('dashboard.error_message', 'Failed to load dashboard data. Please try again.')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={handleRetry}>
                {safeTranslate('dashboard.retry', 'Retry')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (!currentStore) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {safeTranslate('dashboard.no_store', 'No Store Selected')}
          </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" paragraph>
              {safeTranslate(
                'dashboard.no_store_message',
                'Please select a store from the dropdown menu to view the dashboard.'
              )}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Destructure dash data for cleaner usage below
  const {
    totalSales,
    totalExpenses,
    totalCustomers,
    salesGrowth,
    paymentReceived,
    paymentSent,
    topSellingProducts = [],
    recentSales = [],
    stockAlerts = [],
    topCustomers = [],
  } = dashboardData || {};

  // Format values for display - handle potentially different data structures from reports API
  const formattedTotalSales = totalSales
    ? `$${typeof totalSales === 'string' ? parseFloat(totalSales).toFixed(2) : totalSales.toFixed(2)}`
    : '$0.00';
  const formattedTotalExpenses = totalExpenses
    ? `$${typeof totalExpenses === 'string' ? parseFloat(totalExpenses).toFixed(2) : totalExpenses.toFixed(2)}`
    : '$0.00';
  const formattedPaymentReceived = paymentReceived
    ? `$${typeof paymentReceived === 'string' ? parseFloat(paymentReceived).toFixed(2) : paymentReceived.toFixed(2)}`
    : '$0.00';
  const formattedTotalCustomers = totalCustomers
    ? typeof totalCustomers === 'string'
      ? totalCustomers
      : totalCustomers.toString()
    : '0';

  // Calculate growth percentages
  const salesGrowthFormatted = salesGrowth ? `${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(1)}%` : '0%';
  const expensesChangePercentage =
    totalExpenses && totalSales ? `${((totalExpenses / (totalSales || 1)) * 100).toFixed(1)}%` : '0%';
  const paymentsChangePercentage =
    paymentReceived && totalSales ? `${((paymentReceived / (totalSales || 1)) * 100).toFixed(1)}%` : '0%';
  const customersChangePercentage = totalCustomers ? '+NEW' : '0%';

  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Grid container justifyContent="space-between" spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {safeTranslate('dashboard.overview', 'Admin Overview')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack
                direction={{ xs: 'row', sm: 'row' }}
                spacing={1}
                sx={{
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                {['today', 'week', 'month', 'year'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handlePeriodChange(period as DashboardPeriod)}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      textTransform: 'capitalize',
                    }}
                  >
                    {safeTranslate(`dashboard.filter_periods.${period}`, period)}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Main Stats */}
        <Grid container spacing={3} sx={{ mb: { xs: 2, sm: 4 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={safeTranslate('dashboard.stats.total_sales', 'Total Sales')}
              value={formattedTotalSales}
              change={salesGrowthFormatted}
              positive={salesGrowth ? salesGrowth >= 0 : true}
              icon={<TrendingUpIcon sx={{ fontSize: 30, color: '#2979ff' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={safeTranslate('dashboard.stats.total_expenses', 'Total Expenses')}
              value={formattedTotalExpenses}
              change={expensesChangePercentage}
              positive={false}
              icon={<TrendingDownIcon sx={{ fontSize: 30, color: '#ff9800' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={safeTranslate('dashboard.stats.payment_received', 'Payment Received')}
              value={formattedPaymentReceived}
              change={paymentsChangePercentage}
              positive={true}
              icon={<ReceiptIcon sx={{ fontSize: 30, color: '#4caf50' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={safeTranslate('dashboard.stats.total_customers', 'Total Customers')}
              value={formattedTotalCustomers}
              change={customersChangePercentage}
              positive={true}
              icon={<PeopleIcon sx={{ fontSize: 30, color: '#f44336' }} />}
            />
          </Grid>
        </Grid>

        {/* Sales vs Expenses Chart */}
        <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 4 } }}>
          <CardHeader
            title={safeTranslate('dashboard.charts.sales_vs_expenses', 'Sales vs Expenses')}
            sx={{ p: 0, mb: 2 }}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Box sx={{ p: 2, height: 350 }}>
            <DynamicApexChart
              options={dailySalesChartOptions}
              series={dailySalesChartSeries}
              type="line"
              height={350}
            />
          </Box>
        </Card>

        {/* Reports Section */}
        <ReportsSection storeId={currentStore?.id} />

        {/* Overview Sections */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TopSellingProducts products={Array.isArray(topSellingProducts) ? topSellingProducts : []} t={t} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales sales={Array.isArray(recentSales) ? recentSales : []} t={t} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StockAlerts alerts={Array.isArray(stockAlerts) ? stockAlerts : []} t={t} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopCustomers customers={Array.isArray(topCustomers) ? topCustomers : []} t={t} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  const { t, i18n } = useTranslation('admin');

  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    // First try to get the translation directly
    const result = t(key);

    // If we're using a non-English language, show more detailed debugging
    if (process.env.NODE_ENV === 'development' && i18n.language !== 'en') {
      console.log(`Translating [${key}] in language [${i18n.language}]:`, result);
      console.log('Has resource bundle:', i18n.hasResourceBundle(i18n.language, 'admin'));

      // Try to inspect the resource directly
      const resourceBundle = i18n.getResourceBundle(i18n.language, 'admin');
      if (resourceBundle) {
        // Get nested keys
        const keys = key.split('.');
        let value = resourceBundle;
        for (const k of keys) {
          value = value?.[k];
          if (!value) break;
        }
        console.log('Direct resource lookup:', value);
      }
    }

    // If the result is the same as the key, it means translation failed
    if (result === key) {
      return fallback;
    }

    return result;
  };

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Box
          sx={{
            bgcolor: positive ? 'success.lighter' : 'error.lighter',
            color: positive ? 'success.main' : 'error.main',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {positive ? (
          <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
        ) : (
          <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
        )}
        <Typography
          variant="caption"
          sx={{
            color: positive ? 'success.main' : 'error.main',
            fontWeight: 'medium',
          }}
        >
          {change}
        </Typography>
      </Box>
    </Card>
  );
}

// Reports Section Component
function ReportsSection({ storeId }: { storeId: string | undefined }) {
  const { t } = useTranslation('admin');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('sales');
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Format dates for API
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

  // Fetch available reports
  const { data: availableReports, isLoading: isLoadingReports } = useAvailableReports(storeId);

  // Fetch selected report
  const {
    data: reportData,
    isLoading: isLoadingReport,
    error: reportError,
    refetch: refetchReport,
  } = useReport(storeId, selectedReportType, {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });

  // Reset active section when report type changes
  useEffect(() => {
    setActiveSection(null);
  }, [selectedReportType]);

  const handleReportTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedReportType(event.target.value as ReportType);
    setActiveSection(null); // Reset active section when changing report type
  };

  // Handle displaying the report data based on its format
  const renderReportData = () => {
    if (isLoadingReport) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (reportError) {
      return (
        <Box sx={{ p: 3, bgcolor: '#fff8f8', color: 'error.main', borderRadius: 1 }}>
          <Typography variant="body1">
            {reportError instanceof Error ? reportError.message : 'Error loading report'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => refetchReport()}
            sx={{ mt: 2 }}
          >
            {t('common.retry', 'Retry')}
          </Button>
        </Box>
      );
    }

    if (!reportData) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.reports.select_prompt', 'Select a report type and date range to view data')}
          </Typography>
        </Box>
      );
    }

    try {
      // Extract report data for rendering
      const tableData: Record<string, any>[] = [];
      const tableColumns: string[] = [];

      // Special handling for specific report sections
      // These are arrays with complex objects that need special rendering
      const specialSections = [
        'top_selling_products',
        'daily_sales_breakdown',
        'payment_mode_breakdown',
        'top_customers',
        'low_stock_products',
        'out_of_stock_products',
        'overstocked_products',
        'top_performing_products',
        'worst_performing_products',
        'product_category_breakdown',
        'seasonal_product_trends',
        'profit_by_product_category',
        'profit_trend',
        'revenue_by_payment_mode',
        'revenue_by_product_category',
        'daily_revenue',
        'monthly_revenue',
      ];

      // Use the active section if set, otherwise find the first available section
      const sectionToShow =
        activeSection ||
        specialSections.find(
          (section) => reportData[section] && Array.isArray(reportData[section]) && reportData[section].length > 0
        );

      console.log('Current active section:', activeSection);
      console.log('Section being shown:', sectionToShow);
      console.log(
        'Available sections:',
        specialSections.filter(
          (section) => reportData[section] && Array.isArray(reportData[section]) && reportData[section].length > 0
        )
      );

      if (sectionToShow && reportData[sectionToShow] && Array.isArray(reportData[sectionToShow])) {
        // Show a specific data section as a table
        if (reportData[sectionToShow].length > 0) {
          reportData[sectionToShow].forEach((item) => {
            if (item && typeof item === 'object') {
              // Handle special case for seasonal_product_trends with product_breakdown
              if (item.product_breakdown && typeof item.product_breakdown === 'object') {
                // Convert product_breakdown object to string
                const productBreakdownStr = Object.entries(item.product_breakdown)
                  .map(([product, quantity]) => `${product}: ${quantity}`)
                  .join(', ');

                // Create a copy without the original object
                const itemCopy = { ...item };
                itemCopy.product_breakdown = productBreakdownStr;
                tableData.push(itemCopy);
              } else {
                tableData.push(item);
              }
            }
          });

          if (tableData.length > 0 && tableData[0]) {
            Object.keys(tableData[0]).forEach((key) => {
              if (key) tableColumns.push(key);
            });
          }
        }
      } else {
        // Default handling for general report properties
        // Filter out array properties and nested objects that we don't want to display directly
        const excludedKeys = [
          'title',
          'description',
          'store',
          'date_range_start',
          'date_range_end',
          ...specialSections,
        ];

        Object.keys(reportData || {}).forEach((key) => {
          if (key && !excludedKeys.includes(key) && typeof reportData[key] !== 'object') {
            tableColumns.push(key);
          }
        });

        if (tableColumns.length > 0) {
          // Create a single row with the data
          const rowData: Record<string, any> = {};
          tableColumns.forEach((key) => {
            rowData[key] = reportData[key];
          });
          tableData.push(rowData);
        }
      }

      // Render based on report type
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {reportData?.title || `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report`}
          </Typography>
          {reportData?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {typeof reportData.description === 'object'
                ? JSON.stringify(reportData.description)
                : reportData.description}
            </Typography>
          )}

          {/* Show section name if we're displaying a special section */}
          {sectionToShow && (
            <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>
              {sectionToShow.replace(/_/g, ' ').toUpperCase()}
            </Typography>
          )}

          {tableData.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    {tableColumns.map((key, idx) => (
                      <TableCell
                        key={`header-${idx}-${key}`}
                        sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}
                      >
                        {key ? key.replace(/_/g, ' ').toUpperCase() : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow key={`row-${index}`} sx={{ '&:nth-of-type(even)': { bgcolor: 'action.hover' } }}>
                      {tableColumns.map((key, keyIdx) => {
                        const cellValue = item && key ? item[key] : null;
                        return (
                          <TableCell key={`cell-${index}-${keyIdx}-${key}`}>
                            {typeof cellValue === 'number'
                              ? cellValue.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                  style:
                                    key.includes('price') ||
                                    key.includes('amount') ||
                                    (key.includes('total') && !key.includes('quantity')) ||
                                    key.includes('revenue') ||
                                    key.includes('profit') ||
                                    key.includes('margin') ||
                                    key.includes('value') ||
                                    key.includes('spent')
                                      ? 'currency'
                                      : 'decimal',
                                  currency: 'ETB',
                                })
                              : typeof cellValue === 'boolean'
                                ? cellValue
                                  ? '✓'
                                  : '✗'
                                : typeof cellValue === 'object' && cellValue !== null
                                  ? JSON.stringify(cellValue)
                                  : cellValue || '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.reports.no_data', 'No report data available for the selected period')}
              </Typography>
            </Box>
          )}

          {/* Display additional data sections buttons if available */}
          {specialSections.filter(
            (section) => reportData[section] && Array.isArray(reportData[section]) && reportData[section].length > 0
          ).length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                View report sections:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {specialSections
                  .filter(
                    (section) =>
                      reportData[section] && Array.isArray(reportData[section]) && reportData[section].length > 0
                  )
                  .map((section) => (
                    <Button
                      key={section}
                      variant={activeSection === section ? 'contained' : 'outlined'}
                      size="small"
                      sx={{ mb: 1 }}
                      onClick={() => setActiveSection(section)}
                    >
                      {section.replace(/_/g, ' ')}
                    </Button>
                  ))}
              </Stack>
            </Box>
          )}
        </Box>
      );
    } catch (err) {
      console.error('Error rendering report data:', err);
      return (
        <Box sx={{ p: 3, bgcolor: '#fff8f8', color: 'error.main', borderRadius: 1 }}>
          <Typography variant="body1">
            Error rendering report data. Please try a different report type or date range.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => refetchReport()}
            sx={{ mt: 2 }}
          >
            {t('common.retry', 'Retry')}
          </Button>
        </Box>
      );
    }
  };

  return (
    <Card sx={{ mb: { xs: 2, sm: 4 } }}>
      <CardHeader
        title={t('dashboard.reports.title', 'Reports')}
        subheader={t('dashboard.reports.subtitle', 'Analytical reports from your store data')}
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'body2' }}
      />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <Select
                value={selectedReportType}
                onChange={handleReportTypeChange as any}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="sales">{t('dashboard.reports.types.sales', 'Sales Report')}</MenuItem>
                <MenuItem value="customer">{t('dashboard.reports.types.customer', 'Customer Report')}</MenuItem>
                <MenuItem value="financial">{t('dashboard.reports.types.financial', 'Financial Report')}</MenuItem>
                <MenuItem value="inventory">{t('dashboard.reports.types.inventory', 'Inventory Report')}</MenuItem>
                <MenuItem value="product">{t('dashboard.reports.types.product', 'Product Report')}</MenuItem>
                <MenuItem value="profit">{t('dashboard.reports.types.profit', 'Profit Report')}</MenuItem>
                <MenuItem value="purchase">{t('dashboard.reports.types.purchase', 'Purchase Report')}</MenuItem>
                <MenuItem value="revenue">{t('dashboard.reports.types.revenue', 'Revenue Report')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('dashboard.reports.start_date', 'Start Date')}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <DatePicker
                  label={t('dashboard.reports.end_date', 'End Date')}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
              <Button variant="contained" onClick={() => refetchReport()} startIcon={<RefreshIcon />}>
                {t('dashboard.reports.refresh', 'Refresh')}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {renderReportData()}
      </Box>
    </Card>
  );
}
