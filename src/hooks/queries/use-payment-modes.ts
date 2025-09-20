import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  transactionsApi, 
  PaymentMode, 
  PaymentModeCreateData, 
  PaymentModeUpdateData 
} from '@/services/api/transactions';

// Define cache keys
export const paymentModeKeys = {
  all: ['paymentModes'] as const,
  lists: () => [...paymentModeKeys.all, 'list'] as const,
  list: (storeId: string) => [...paymentModeKeys.lists(), storeId] as const,
  details: () => [...paymentModeKeys.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...paymentModeKeys.details(), storeId, id] as const,
};

// Get all payment modes for a store
export function usePaymentModes(storeId: string | undefined) {
  return useQuery<PaymentMode[]>({
    queryKey: paymentModeKeys.list(storeId || ''),
    queryFn: () => storeId ? transactionsApi.getPaymentModes(storeId) : Promise.resolve([]),
    enabled: !!storeId,
  });
}

// Get a specific payment mode by ID
export function usePaymentMode(storeId: string | undefined, paymentModeId: string | undefined) {
  return useQuery<PaymentMode>({
    queryKey: paymentModeKeys.detail(storeId || '', paymentModeId || ''),
    queryFn: () => storeId && paymentModeId ? transactionsApi.getPaymentMode(storeId, paymentModeId) : Promise.resolve(null as any),
    enabled: !!storeId && !!paymentModeId,
  });
}

// Create a new payment mode
export function useCreatePaymentMode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: PaymentModeCreateData }) => 
      transactionsApi.createPaymentMode(storeId, data),
    onSuccess: (data, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentModeKeys.list(storeId) });
    },
  });
}

// Update an existing payment mode
export function useUpdatePaymentMode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string, data: PaymentModeUpdateData }) => 
      transactionsApi.updatePaymentMode(storeId, id, data),
    onSuccess: (data, { storeId, id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentModeKeys.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: paymentModeKeys.list(storeId) });
    },
  });
}

// Delete a payment mode
export function useDeletePaymentMode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      transactionsApi.deletePaymentMode(storeId, id),
    onSuccess: (_, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentModeKeys.list(storeId) });
    },
  });
} 