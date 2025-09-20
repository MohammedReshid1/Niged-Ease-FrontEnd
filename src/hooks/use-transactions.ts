import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  transactionsApi, 
  PaymentMode, 
  PaymentModeCreateData, 
  PaymentModeUpdateData 
} from '@/services/api/transactions';
import { toast } from 'sonner';

// Payment Modes hooks
export const usePaymentModes = (storeId: string) => {
  return useQuery({
    queryKey: ['payment-modes', storeId],
    queryFn: () => transactionsApi.getPaymentModes(storeId),
    enabled: !!storeId
  });
};

export const usePaymentMode = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['payment-modes', storeId, id],
    queryFn: () => transactionsApi.getPaymentMode(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreatePaymentMode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: PaymentModeCreateData }) => 
      transactionsApi.createPaymentMode(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      toast.success('Payment mode created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating payment mode:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create payment mode');
    },
  });
};

export const useUpdatePaymentMode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: PaymentModeUpdateData }) => 
      transactionsApi.updatePaymentMode(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId, id] });
      toast.success('Payment mode updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating payment mode:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update payment mode');
    },
  });
};

export const useDeletePaymentMode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      transactionsApi.deletePaymentMode(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      toast.success('Payment mode deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting payment mode:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete payment mode');
    },
  });
}; 