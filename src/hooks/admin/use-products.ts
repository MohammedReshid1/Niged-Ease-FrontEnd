import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';

export const useProducts = (storeId: string) => {
  return useQuery({
    queryKey: ['admin-products', storeId],
    queryFn: () => inventoryApi.getProducts(storeId),
    enabled: !!storeId,
  });
}; 