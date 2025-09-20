import { coreApiClient } from './client';
import tokenStorage from '@/utils/token-storage';
import { storesApi } from './stores';

// Base types for clothing features
export interface Collection {
  id: string;
  store_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
  store: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionCreateData {
  store_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
}

export interface Color {
  id: string;
  store_id: string;
  name: string;
  color_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ColorCreateData {
  store_id: string;
  name: string;
  color_code: string;
  is_active: boolean;
}

export interface Season {
  id: string;
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SeasonCreateData {
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

// Get the first available store ID for the user
const getStoreId = async (): Promise<string> => {
  const userInfo = tokenStorage.getUserInfo();
  
  // First check if user has a direct store_id in their token
  if (userInfo?.store_id) {
    return userInfo.store_id;
  }
  
  try {
    // If no store_id in token, attempt to get stores for the user's company
    const stores = await storesApi.getStores(userInfo?.company_id);
    
    if (stores && stores.length > 0) {
      // Return the first active store
      const activeStore = stores.find(store => store.is_active);
      if (activeStore) {
        return activeStore.id;
      }
      
      // If no active store found, return the first store
      return stores[0].id;
    }
    
    throw new Error('No stores available for the current user');
  } catch (error) {
    console.error('Error getting store ID:', error);
    throw new Error('Store ID is required for clothing operations');
  }
};

// Clothing API service
export const clothingApi = {
  // Collections
  getCollections: async (storeId?: string): Promise<Collection[]> => {
    try {
      // If no storeId is provided, try to get it
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Collection[]>(`/clothings/stores/${storeId}/collections/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },
  
  getCollection: async (id: string, storeId?: string): Promise<Collection> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Collection>(`/clothings/stores/${storeId}/collections/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  },
  
  createCollection: async (data: Omit<CollectionCreateData, 'store_id'>, storeId?: string): Promise<Collection> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      console.log('Using store ID:', storeId);
      
      // Important: Include store_id in the request body
      const requestData: CollectionCreateData = {
        ...data,
        store_id: storeId
      };
      
      console.log('Creating collection with data:', requestData);
      
      // Make the API request with the store_id in both the URL and request body
      const response = await coreApiClient.post<Collection>(
        `/clothings/stores/${storeId}/collections/`, 
        requestData
      );
      
      console.log('Collection created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating collection:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },
  
  updateCollection: async (id: string, data: Partial<CollectionCreateData>, storeId?: string): Promise<Collection> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      // Important: Include store_id in the request body
      const requestData = {
        ...data,
        store_id: storeId
      };
      
      const response = await coreApiClient.put<Collection>(`/clothings/stores/${storeId}/collections/${id}/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },
  
  deleteCollection: async (id: string, storeId?: string): Promise<void> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      await coreApiClient.delete(`/clothings/stores/${storeId}/collections/${id}/`);
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },
  
  // Colors
  getColors: async (storeId?: string): Promise<Color[]> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Color[]>(`/clothings/stores/${storeId}/colors/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },
  
  getColor: async (id: string, storeId?: string): Promise<Color> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Color>(`/clothings/stores/${storeId}/colors/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting color:', error);
      throw error;
    }
  },
  
  createColor: async (data: Omit<ColorCreateData, 'store_id'>, storeId?: string): Promise<Color> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      // Important: Include store_id in the request body
      const requestData: ColorCreateData = {
        ...data,
        store_id: storeId
      };
      
      const response = await coreApiClient.post<Color>(`/clothings/stores/${storeId}/colors/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  },
  
  updateColor: async (id: string, data: Partial<ColorCreateData>, storeId?: string): Promise<Color> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      // Important: Include store_id in the request body
      const requestData = {
        ...data,
        store_id: storeId
      };
      
      const response = await coreApiClient.put<Color>(`/clothings/stores/${storeId}/colors/${id}/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  },
  
  deleteColor: async (id: string, storeId?: string): Promise<void> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      await coreApiClient.delete(`/clothings/stores/${storeId}/colors/${id}/`);
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  },
  
  // Seasons
  getSeasons: async (storeId?: string): Promise<Season[]> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Season[]>(`/clothings/stores/${storeId}/seasons/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seasons:', error);
      throw error;
    }
  },
  
  getSeason: async (id: string, storeId?: string): Promise<Season> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      const response = await coreApiClient.get<Season>(`/clothings/stores/${storeId}/seasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting season:', error);
      throw error;
    }
  },
  
  createSeason: async (data: Omit<SeasonCreateData, 'store_id'>, storeId?: string): Promise<Season> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      // Important: Include store_id in the request body
      const requestData: SeasonCreateData = {
        ...data,
        store_id: storeId
      };
      
      const response = await coreApiClient.post<Season>(`/clothings/stores/${storeId}/seasons/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating season:', error);
      throw error;
    }
  },
  
  updateSeason: async (id: string, data: Partial<SeasonCreateData>, storeId?: string): Promise<Season> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      // Important: Include store_id in the request body
      const requestData = {
        ...data,
        store_id: storeId
      };
      
      const response = await coreApiClient.put<Season>(`/clothings/stores/${storeId}/seasons/${id}/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating season:', error);
      throw error;
    }
  },
  
  deleteSeason: async (id: string, storeId?: string): Promise<void> => {
    try {
      if (!storeId) {
        storeId = await getStoreId();
      }
      
      await coreApiClient.delete(`/clothings/stores/${storeId}/seasons/${id}/`);
    } catch (error) {
      console.error('Error deleting season:', error);
      throw error;
    }
  }
}; 