import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, Product } from '@/services/api/inventory';

// Define cache keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (storeId: string) => [...productKeys.lists(), storeId] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...productKeys.details(), storeId, id] as const,
};

// Get all products for a store
export function useProducts(storeId: string | undefined) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(storeId || ''),
    queryFn: () => storeId ? inventoryApi.getProducts(storeId) : Promise.resolve([]),
    enabled: !!storeId,
  });
}

// Get a specific product by ID
export function useProduct(storeId: string | undefined, productId: string | undefined) {
  return useQuery<Product>({
    queryKey: productKeys.detail(storeId || '', productId || ''),
    queryFn: () => storeId && productId ? inventoryApi.getProduct(storeId, productId) : Promise.resolve(null as any),
    enabled: !!storeId && !!productId,
  });
}

// Create a new product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: any }) => 
      inventoryApi.createProduct(storeId, data),
    onSuccess: (data, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.list(storeId) });
    },
  });
}

// Update an existing product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string, data: any }) => 
      inventoryApi.updateProduct(storeId, id, data),
    onSuccess: (data, { storeId, id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: productKeys.list(storeId) });
    },
  });
}

// Delete a product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      inventoryApi.deleteProduct(storeId, id),
    onSuccess: (_, { storeId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.list(storeId) });
    },
  });
} 