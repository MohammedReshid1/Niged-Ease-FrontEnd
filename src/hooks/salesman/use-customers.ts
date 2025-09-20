import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Customer, CustomerCreateData, CustomerUpdateData } from '@/services/api/customers';

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all customers with pagination and filters
export function useCustomers(params: CustomersParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.store_id) queryParams.append('store_id', params.store_id);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/customers?${queryParams.toString()}`;
  
  return useApiQuery<CustomersResponse>(
    ['customers', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single customer by ID
export function useCustomer(id: string) {
  return useApiQuery<Customer>(
    ['customer', id], 
    `/customers/${id}`,
    {
      enabled: !!id,
    }
  );
}

// Create a new customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Customer, CustomerCreateData>(
    '/customers',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      },
    }
  );
}

// Update a customer
export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Customer, CustomerUpdateData>(
    `/customers/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customer', id] });
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      },
    }
  );
}

// Delete a customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { id: string }>(
    '/customers',
    'DELETE',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      },
    }
  );
}

// Get customer statistics
export function useCustomerStats(store_id: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('store_id', store_id);
  
  return useApiQuery<{
    total_customers: number;
    new_customers_this_month: number;
    active_customers: number;
    customers_by_city: { city: string; count: number }[];
    top_customers: { customer_name: string; orders: number; revenue: number }[];
    customer_growth: { period: string; count: number }[];
  }>(
    ['customer-stats', store_id], 
    `/customers/stats?${queryParams.toString()}`
  );
} 