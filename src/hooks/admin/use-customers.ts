import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';

export const useCustomers = (storeId: string) => {
  return useQuery({
    queryKey: ['admin-customers', storeId],
    queryFn: () => transactionsApi.getCustomers(storeId),
    enabled: !!storeId,
  });
}; 