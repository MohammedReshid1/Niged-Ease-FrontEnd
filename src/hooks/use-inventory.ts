import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  inventoryApi, 
  ProductUnit, 
  ProductUnitCreateData, 
  ProductUnitUpdateData
} from '@/services/api/inventory';
import { toast } from 'sonner';

// Product Units hooks
export const useProductUnits = (storeId: string) => {
  return useQuery({
    queryKey: ['product-units', storeId],
    queryFn: () => inventoryApi.getProductUnits(storeId),
    enabled: !!storeId
  });
};

export const useProductUnit = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['product-units', storeId, id],
    queryFn: () => inventoryApi.getProductUnit(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateProductUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: ProductUnitCreateData }) => 
      inventoryApi.createProductUnit(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      toast.success('Product unit created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating product unit:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create product unit');
    },
  });
};

export const useUpdateProductUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: ProductUnitUpdateData }) => 
      inventoryApi.updateProductUnit(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      queryClient.invalidateQueries({ queryKey: ['product-units', storeId, id] });
      toast.success('Product unit updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating product unit:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update product unit');
    },
  });
};

export const useDeleteProductUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      inventoryApi.deleteProductUnit(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      toast.success('Product unit deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting product unit:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete product unit');
    },
  });
}; 