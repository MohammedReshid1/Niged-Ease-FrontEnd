import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Inventory, InventoryStore } from '@/services/api/inventory';

export interface InventoryResponse {
  data: Inventory[];
  total: number;
  page: number;
  limit: number;
}

export interface InventoryParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all inventory items with pagination and filters
export function useInventory(params: InventoryParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.store_id) queryParams.append('store_id', params.store_id);
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/inventory?${queryParams.toString()}`;
  
  return useApiQuery<InventoryResponse>(
    ['inventory', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single inventory item by ID
export function useInventoryItem(id: string) {
  return useApiQuery<Inventory>(
    ['inventory-item', id], 
    `/inventory/${id}`,
    {
      enabled: !!id,
    }
  );
}

// Create a new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Inventory, Partial<Inventory>>(
    '/inventory',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

// Update an inventory item
export function useUpdateInventoryItem(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Inventory, Partial<Inventory>>(
    `/inventory/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', id] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

// Delete an inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { id: string }>(
    '/inventory',
    'DELETE',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

export interface InventoryAdjustment {
  id: string;
  inventory: Inventory;
  quantity: string;
  type: 'increase' | 'decrease';
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryAdjustmentCreateData {
  inventory_id: string;
  quantity: string;
  type: 'increase' | 'decrease';
  reason: string;
}

// Create an inventory adjustment
export function useCreateInventoryAdjustment() {
  const queryClient = useQueryClient();
  
  return useApiMutation<InventoryAdjustment, InventoryAdjustmentCreateData>(
    '/inventory/adjustments',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-adjustments'] });
      },
    }
  );
}

// Get inventory statistics
export function useInventoryStats(store_id: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('store_id', store_id);
  
  return useApiQuery<{
    total_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_value: number;
    category_distribution: { category: string; count: number }[];
    recent_adjustments: InventoryAdjustment[];
  }>(
    ['inventory-stats', store_id], 
    `/inventory/stats?${queryParams.toString()}`
  );
} 