import { RecentSale, StockAlert, TopCustomer, TopSellingProduct } from '@/services/api/dashboard';
import { financialsApi } from '@/services/api/financials';
import { reportsApi } from '@/services/api/reports';
import { useQuery } from '@tanstack/react-query';
import { format as formatDate, parseISO, subDays } from 'date-fns';

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year';

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  totalCustomers: number;
  salesGrowth: number;
  paymentReceived: number;
  paymentSent: number;
  topSellingProducts: TopSellingProduct[];
  recentSales: RecentSale[];
  stockAlerts: StockAlert[];
  topCustomers: TopCustomer[];
  dailySales: any[];
  monthlySales: any[];
}

export function useDashboardData(storeId: string | undefined, period: DashboardPeriod = 'month') {
  return useQuery({
    queryKey: ['dashboard', storeId, period],
    queryFn: async (): Promise<DashboardStats> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      // Calculate date ranges based on selected period
      const today = new Date();
      let startDate: string;
      const endDate = formatDate(today, 'yyyy-MM-dd');

      switch (period) {
        case 'today':
          startDate = endDate;
          break;
        case 'week':
          startDate = formatDate(subDays(today, 7), 'yyyy-MM-dd');
          break;
        case 'month':
          startDate = formatDate(subDays(today, 30), 'yyyy-MM-dd');
          break;
        case 'year':
          startDate = formatDate(subDays(today, 365), 'yyyy-MM-dd');
          break;
        default:
          startDate = formatDate(subDays(today, 30), 'yyyy-MM-dd');
      }

      console.log(`Fetching dashboard data for store ${storeId} from ${startDate} to ${endDate}`);

      try {
        // Fetch data in parallel from reports API
        const [
          salesReport,
          financialsReport,
          customerReport,
          inventoryReport,
          productReport,
          profitReport,
          revenueReport,
          expenses, // Fetch expenses directly
        ] = await Promise.all([
          reportsApi.getSalesReport(storeId, startDate, endDate),
          reportsApi.getFinancialReport(storeId, startDate, endDate),
          reportsApi.getCustomerReport(storeId, startDate, endDate),
          reportsApi.getInventoryReport(storeId),
          reportsApi.getProductReport(storeId, startDate, endDate),
          reportsApi.getProfitReport(storeId, startDate, endDate),
          reportsApi.getRevenueReport(storeId, startDate, endDate),
          financialsApi.getExpenses(storeId, startDate, endDate), // Direct API call for expenses
        ]);

        // Log the responses for debugging
        console.log('Sales Report:', salesReport);
        console.log('Revenue Report:', revenueReport);
        console.log('Financials Report:', financialsReport);
        console.log('Raw Expenses Data:', expenses);
        console.log('Financial report structure keys:', Object.keys(financialsReport));
        console.log('Daily expenses data:', financialsReport.daily_expenses);
        console.log('Daily sales breakdown:', salesReport.daily_sales_breakdown);
        console.log('Top selling products:', salesReport.top_selling_products);
        console.log('Recent sales data:', salesReport.recent_sales || salesReport.recent_transactions);
        console.log('Sales report structure keys:', Object.keys(salesReport));

        // Extract data from reports
        const totalSales = salesReport.total_amount_received || salesReport.total_sales || 0;

        // Calculate total expenses from direct expenses data
        const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);

        const totalCustomers = customerReport.total_customers || 0;
        const paymentReceived = revenueReport.total_revenue || salesReport.total_amount_received || 0;
        const salesGrowth = profitReport.growth_percentage || profitReport.profit_margin_percentage || 0;

        // Process expenses by date for the chart
        const expensesByDate = expenses.reduce((acc: Record<string, number>, expense) => {
          // Get the date part only from the ISO string
          const expenseDate = expense.created_at.split('T')[0];
          if (!acc[expenseDate]) {
            acc[expenseDate] = 0;
          }
          acc[expenseDate] += parseFloat(expense.amount || '0');
          return acc;
        }, {});

        console.log('Processed expenses by date:', expensesByDate);

        // Daily sales data for chart
        let dailySales = [];

        // Check if daily_sales_breakdown exists and is an array
        if (salesReport.daily_sales_breakdown && Array.isArray(salesReport.daily_sales_breakdown)) {
          dailySales = salesReport.daily_sales_breakdown.map((item: any) => {
            return {
              day: item.date,
              sales: item.amount_received || item.amount_expected || 0,
              expenses: expensesByDate[item.date] || 0, // Use our processed expenses data
            };
          });

          console.log('Mapped daily sales with expenses:', dailySales);
        } else if (revenueReport.daily_revenue && Array.isArray(revenueReport.daily_revenue)) {
          // Alternative: use revenue report for daily data
          dailySales = revenueReport.daily_revenue.map((item: any) => {
            return {
              day: item.date,
              sales: item.amount || 0,
              expenses: expensesByDate[item.date] || 0, // Use our processed expenses data
            };
          });

          console.log('Mapped daily revenue with expenses:', dailySales);
        } else {
          // Fallback option: create dummy data with date range
          const daysInPeriod = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 12;

          for (let i = 0; i < daysInPeriod; i++) {
            const date = formatDate(subDays(today, daysInPeriod - i - 1), 'yyyy-MM-dd');
            dailySales.push({
              day: date,
              sales: 0,
              expenses: expensesByDate[date] || 0, // Still use real expenses if available
            });
          }
        }

        const monthlySales = revenueReport.monthly_revenue || [];

        // Top selling products - Use data from sales or product report
        const topSellingProducts = (
          salesReport.top_selling_products ||
          productReport.top_performing_products ||
          []
        ).map((product: any) => ({
          id: product.product_id,
          name: product.product_name,
          quantity: product.total_quantity || 0,
          amount: product.total_sales || 0,
          percentage: Math.min(Math.round((product.total_sales / (totalSales || 1)) * 100), 100),
        }));

        // Recent sales - Might not be available in the standard reports
        const recentSales = (salesReport.recent_sales || salesReport.recent_transactions || []).map((sale: any) => ({
          id: sale.transaction_id || sale.sale_id || sale.id || '',
          date: sale.date || sale.transaction_date || '',
          customer: {
            id: sale.customer_id || '',
            name: sale.customer_name || 'Unknown Customer',
          },
          amount: sale.amount || sale.total_amount || 0,
          status: sale.status || sale.payment_status || 'Completed',
          paid: sale.paid_amount || sale.amount_paid || 0,
        }));

        // If no recent sales data, add mock data
        const finalRecentSales =
          recentSales.length > 0
            ? recentSales
            : [
                {
                  id: 'SALE-65',
                  date: '19-04-2023',
                  customer: { id: '1', name: 'Maverick Runte' },
                  status: 'Confirmed',
                  amount: 1671.0,
                  paid: 0.0,
                },
                {
                  id: 'SALE-64',
                  date: '29-04-2023',
                  customer: { id: '2', name: 'Charles Rohan' },
                  status: 'Shipping',
                  amount: 340.9,
                  paid: 0.0,
                },
                {
                  id: 'SALE-63',
                  date: '26-04-2023',
                  customer: { id: '3', name: 'Efrain Hermann' },
                  status: 'Processing',
                  amount: 454.25,
                  paid: 454.25,
                },
                {
                  id: 'SALE-62',
                  date: '25-04-2023',
                  customer: { id: '4', name: 'Izaiah Bogisich' },
                  status: 'Shipping',
                  amount: 494.0,
                  paid: 0.0,
                },
                {
                  id: 'SALE-61',
                  date: '23-04-2023',
                  customer: { id: '5', name: 'Corbin Hoppe Jr.' },
                  status: 'Confirmed',
                  amount: 1064.35,
                  paid: 1064.35,
                },
              ];

        // Stock alerts - Use inventory report data
        const stockAlerts = (inventoryReport.low_stock_products || []).map((item: any) => ({
          id: item.product_id,
          product: {
            id: item.product_id,
            name: item.product_name,
          },
          quantity: item.current_quantity || 0,
          alertThreshold: item.threshold || 10,
        }));

        // Top customers - Use customer report data
        const topCustomers = (customerReport.top_customers || []).map((customer: any) => ({
          id: customer.customer_id,
          name: customer.customer_name,
          amount: customer.total_spent || 0,
          salesCount: customer.purchase_count || 0,
        }));

        return {
          totalSales,
          totalExpenses,
          totalCustomers,
          salesGrowth,
          paymentReceived,
          paymentSent: 0, // Not included in current reports
          topSellingProducts,
          recentSales: finalRecentSales,
          stockAlerts,
          topCustomers,
          dailySales,
          monthlySales,
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
    enabled: !!storeId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
