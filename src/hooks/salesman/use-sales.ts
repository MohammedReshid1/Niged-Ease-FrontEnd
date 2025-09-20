import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Sale, SaleCreateData } from '@/services/api/transactions';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'credit-card' | 'bank-transfer' | 'mobile-money';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface OrderInput {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  tax?: number;
  discount?: number;
  paymentMethod: 'cash' | 'credit-card' | 'bank-transfer' | 'mobile-money';
  notes?: string;
}

export interface SalesResponse {
  data: Sale[];
  total: number;
  page: number;
  limit: number;
}

export interface SalesParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all orders with pagination and filters
export function useOrders(params: OrderParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.customerId) queryParams.append('customerId', params.customerId);
  if (params.status) queryParams.append('status', params.status);
  if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/orders?${queryParams.toString()}`;
  
  return useApiQuery<OrdersResponse>(
    ['orders', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single order by ID
export function useOrder(id: string) {
  return useApiQuery<Order>(
    ['order', id], 
    `/orders/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, OrderInput>(
    '/orders',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['sales-stats'] });
      },
    }
  );
}

// Update an order's status
export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, { status: Order['status'] }>(
    `/orders/${id}/status`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['sales-stats'] });
      },
    }
  );
}

// Update an order's payment status
export function useUpdatePaymentStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, { paymentStatus: Order['paymentStatus'] }>(
    `/orders/${id}/payment`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['sales-stats'] });
      },
    }
  );
}

// Cancel an order
export function useCancelOrder(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, { reason: string }>(
    `/orders/${id}/cancel`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['sales-stats'] });
      },
    }
  );
}

// Get customers
export function useCustomers() {
  return useApiQuery<Customer[]>(
    ['customers'], 
    '/customers'
  );
}

// Get a single customer by ID
export function useCustomer(id: string) {
  return useApiQuery<Customer>(
    ['customer', id], 
    `/customers/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Customer, Omit<Customer, 'id' | 'createdAt'>>(
    '/customers',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      },
    }
  );
}

// Get all sales with pagination and filters
export function useSales(params: SalesParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.store_id) queryParams.append('store_id', params.store_id);
  if (params.status) queryParams.append('status', params.status);
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/sales?${queryParams.toString()}`;
  
  return useApiQuery<SalesResponse>(
    ['sales', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single sale by ID
export function useSale(id: string) {
  return useApiQuery<Sale>(
    ['sale', id], 
    `/sales/${id}`,
    {
      enabled: !!id,
    }
  );
}

// Create a new sale
export function useCreateSale() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Sale, SaleCreateData>(
    '/sales',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sales'] });
      },
    }
  );
}

// Update a sale's status
export function useUpdateSaleStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Sale, { status: string }>(
    `/sales/${id}/status`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sale', id] });
        queryClient.invalidateQueries({ queryKey: ['sales'] });
      },
    }
  );
}

// Get sales statistics
export function useSalesStats(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
  return useApiQuery<{
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    top_products: { product_name: string; sold: number }[];
    sales_by_period: { period: string; amount: number }[];
  }>(
    ['sales-stats', period], 
    `/sales/stats?period=${period}`
  );
} 