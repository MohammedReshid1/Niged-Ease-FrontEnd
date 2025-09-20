import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Order, OrderCreateData, OrderUpdateData } from '@/services/api/orders';

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  customer_id?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all orders with pagination and filters
export function useOrders(params: OrdersParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.store_id) queryParams.append('store_id', params.store_id);
  if (params.status) queryParams.append('status', params.status);
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  if (params.customer_id) queryParams.append('customer_id', params.customer_id);
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
      enabled: !!id,
    }
  );
}

// Create a new order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, OrderCreateData>(
    '/orders',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }
  );
}

// Update an order
export function useUpdateOrder(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, OrderUpdateData>(
    `/orders/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }
  );
}

// Delete an order
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { id: string }>(
    '/orders',
    'DELETE',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }
  );
}

// Update order status
export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Order, { status: string }>(
    `/orders/${id}/status`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['order', id] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }
  );
}

// Get order statistics
export function useOrderStats(store_id: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('store_id', store_id);
  
  return useApiQuery<{
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_by_status: { status: string; count: number }[];
    orders_by_period: { period: string; count: number; revenue: number }[];
    top_products: { product_name: string; sold: number; revenue: number }[];
    top_customers: { customer_name: string; orders: number; revenue: number }[];
  }>(
    ['order-stats', store_id], 
    `/orders/stats?${queryParams.toString()}`
  );
} 