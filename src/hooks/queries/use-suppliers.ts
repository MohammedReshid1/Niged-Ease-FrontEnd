import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  transactionsApi, 
  Supplier, 
  SupplierCreateData, 
  SupplierUpdateData 
} from '@/services/api/transactions';

// Define cache keys
export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (storeId: string) => [...supplierKeys.lists(), storeId] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...supplierKeys.details(), storeId, id] as const,
};

// Get all suppliers for a store
export function useSuppliers(storeId: string | undefined) {
  return useQuery<Supplier[]>({
    queryKey: supplierKeys.list(storeId || ''),
    queryFn: () => storeId ? transactionsApi.getSuppliers(storeId) : Promise.resolve([]),
    enabled: !!storeId,
  });
}

// Get a specific supplier by ID
export function useSupplier(storeId: string | undefined, supplierId: string | undefined) {
  return useQuery<Supplier>({
    queryKey: supplierKeys.detail(storeId || '', supplierId || ''),
    queryFn: () => storeId && supplierId ? transactionsApi.getSupplier(storeId, supplierId) : Promise.resolve(null as any),
    enabled: !!storeId && !!supplierId,
  });
}

// Create a new supplier
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: SupplierCreateData }) => 
      transactionsApi.createSupplier(storeId, data),
    onSuccess: (data, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: supplierKeys.list(storeId) });
    },
  });
}

// Update an existing supplier
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string, data: SupplierUpdateData }) => 
      transactionsApi.updateSupplier(storeId, id, data),
    onSuccess: (data, { storeId, id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.list(storeId) });
    },
  });
}

// Delete a supplier
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      transactionsApi.deleteSupplier(storeId, id),
    onSuccess: (_, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: supplierKeys.list(storeId) });
    },
  });
} 