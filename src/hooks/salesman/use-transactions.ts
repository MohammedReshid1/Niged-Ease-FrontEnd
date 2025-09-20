import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';

export const useTransactions = (storeId: string) => {
  return useQuery({
    queryKey: ['salesman-transactions', storeId],
    queryFn: () => transactionsApi.getSales(storeId),
    enabled: !!storeId,
  });
}; 