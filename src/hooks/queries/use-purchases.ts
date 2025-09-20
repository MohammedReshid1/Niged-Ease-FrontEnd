import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  transactionsApi, 
  Purchase, 
  PurchaseCreateData, 
  PurchaseUpdateData,
  PurchaseItem
} from '@/services/api/transactions';

// Define cache keys
export const purchaseKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchaseKeys.all, 'list'] as const,
  list: (storeId: string) => [...purchaseKeys.lists(), storeId] as const,
  details: () => [...purchaseKeys.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...purchaseKeys.details(), storeId, id] as const,
  items: (storeId: string, id: string) => [...purchaseKeys.detail(storeId, id), 'items'] as const,
};

// Get all purchases for a store
export function usePurchases(storeId: string | undefined) {
  return useQuery({
    queryKey: purchaseKeys.list(storeId || ''),
    queryFn: () => storeId ? transactionsApi.getPurchases(storeId) : Promise.resolve([]),
    enabled: !!storeId,
  });
}

// Get a specific purchase by ID
export function usePurchase(storeId: string | undefined, purchaseId: string | undefined) {
  return useQuery({
    queryKey: purchaseKeys.detail(storeId || '', purchaseId || ''),
    queryFn: () => storeId && purchaseId ? transactionsApi.getPurchase(storeId, purchaseId) : Promise.resolve(null as any),
    enabled: !!storeId && !!purchaseId,
  });
}

// Get purchase items for a specific purchase
export function usePurchaseItems(storeId: string | undefined, purchaseId: string | undefined) {
  return useQuery<PurchaseItem[]>({
    queryKey: purchaseKeys.items(storeId || '', purchaseId || ''),
    queryFn: () => storeId && purchaseId ? transactionsApi.getPurchaseItems(storeId, purchaseId) : Promise.resolve([]),
    enabled: !!storeId && !!purchaseId,
  });
}

// Create a new purchase
export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: PurchaseCreateData }) => 
      transactionsApi.createPurchase(storeId, data),
    onSuccess: (data, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: purchaseKeys.list(storeId) });
    },
  });
}

// Update an existing purchase
export function useUpdatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string, data: PurchaseUpdateData }) => 
      transactionsApi.updatePurchase(storeId, id, data),
    onSuccess: (data, { storeId, id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.list(storeId) });
    },
  });
}

// Delete a purchase
export function useDeletePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      transactionsApi.deletePurchase(storeId, id),
    onSuccess: (_, { storeId, id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: purchaseKeys.list(storeId) });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(storeId, id) });
    },
  });
} 