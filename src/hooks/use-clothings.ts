import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clothingsApi, Color, ColorCreateData, ColorUpdateData, Collection, CollectionCreateData, CollectionUpdateData, Season, SeasonCreateData, SeasonUpdateData, Size, SizeCreateData, SizeUpdateData, Material, MaterialCreateData, MaterialUpdateData } from '@/services/api/clothings';
import { toast } from 'sonner';

// Colors hooks
export const useColors = (storeId: string) => {
  return useQuery({
    queryKey: ['colors', storeId],
    queryFn: () => clothingsApi.getColors(storeId),
    enabled: !!storeId
  });
};

export const useColor = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['colors', storeId, id],
    queryFn: () => clothingsApi.getColor(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: ColorCreateData }) => 
      clothingsApi.createColor(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['colors', storeId] });
      toast.success('Color created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create color');
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: ColorUpdateData }) => 
      clothingsApi.updateColor(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['colors', storeId] });
      queryClient.invalidateQueries({ queryKey: ['colors', storeId, id] });
      toast.success('Color updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update color');
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      clothingsApi.deleteColor(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['colors', storeId] });
      toast.success('Color deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete color');
    },
  });
};

// Seasons hooks
export const useSeasons = (storeId: string) => {
  return useQuery({
    queryKey: ['seasons', storeId],
    queryFn: () => clothingsApi.getSeasons(storeId),
    enabled: !!storeId
  });
};

export const useSeason = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['seasons', storeId, id],
    queryFn: () => clothingsApi.getSeason(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: SeasonCreateData }) => 
      clothingsApi.createSeason(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['seasons', storeId] });
      toast.success('Season created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create season');
    },
  });
};

export const useUpdateSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: SeasonUpdateData }) => 
      clothingsApi.updateSeason(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['seasons', storeId] });
      queryClient.invalidateQueries({ queryKey: ['seasons', storeId, id] });
      toast.success('Season updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update season');
    },
  });
};

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      clothingsApi.deleteSeason(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['seasons', storeId] });
      toast.success('Season deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete season');
    },
  });
};

// Collections hooks
export const useCollections = (storeId: string) => {
  return useQuery({
    queryKey: ['collections', storeId],
    queryFn: () => clothingsApi.getCollections(storeId),
    enabled: !!storeId
  });
};

export const useCollection = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['collections', storeId, id],
    queryFn: () => clothingsApi.getCollection(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: CollectionCreateData }) => 
      clothingsApi.createCollection(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['collections', storeId] });
      toast.success('Collection created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create collection');
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: CollectionUpdateData }) => 
      clothingsApi.updateCollection(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['collections', storeId] });
      queryClient.invalidateQueries({ queryKey: ['collections', storeId, id] });
      toast.success('Collection updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update collection');
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      clothingsApi.deleteCollection(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['collections', storeId] });
      toast.success('Collection deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete collection');
    },
  });
};

// Sizes hooks
export const useSizes = (storeId: string) => {
  return useQuery({
    queryKey: ['sizes', storeId],
    queryFn: () => clothingsApi.getSizes(storeId),
    enabled: !!storeId
  });
};

export const useSize = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['sizes', storeId, id],
    queryFn: () => clothingsApi.getSize(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: SizeCreateData }) => 
      clothingsApi.createSize(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['sizes', storeId] });
      toast.success('Size created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create size');
    },
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: SizeUpdateData }) => 
      clothingsApi.updateSize(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['sizes', storeId] });
      queryClient.invalidateQueries({ queryKey: ['sizes', storeId, id] });
      toast.success('Size updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update size');
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      clothingsApi.deleteSize(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['sizes', storeId] });
      toast.success('Size deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete size');
    },
  });
};

// Materials hooks
export const useMaterials = (storeId: string) => {
  return useQuery({
    queryKey: ['materials', storeId],
    queryFn: () => clothingsApi.getMaterials(storeId),
    enabled: !!storeId
  });
};

export const useMaterial = (storeId: string, id: string) => {
  return useQuery({
    queryKey: ['materials', storeId, id],
    queryFn: () => clothingsApi.getMaterial(storeId, id),
    enabled: !!storeId && !!id,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string, data: MaterialCreateData }) => 
      clothingsApi.createMaterial(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['materials', storeId] });
      toast.success('Material created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create material');
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id, data }: { storeId: string, id: string; data: MaterialUpdateData }) => 
      clothingsApi.updateMaterial(storeId, id, data),
    onSuccess: (_, { storeId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['materials', storeId] });
      queryClient.invalidateQueries({ queryKey: ['materials', storeId, id] });
      toast.success('Material updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update material');
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, id }: { storeId: string, id: string }) => 
      clothingsApi.deleteMaterial(storeId, id),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['materials', storeId] });
      toast.success('Material deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete material');
    },
  });
}; 