import { coreApiClient } from './client';

// Interfaces
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

export interface ColorUpdateData extends ColorCreateData {}

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

export interface SeasonUpdateData extends SeasonCreateData {}

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

export interface CollectionUpdateData extends CollectionCreateData {}

export interface Size {
  id: string;
  store_id: string;
  name: string;
  code: string;
  type: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SizeCreateData {
  store_id: string;
  name: string;
  code: string;
  type: string;
  order: number;
}

export interface SizeUpdateData extends SizeCreateData {}

export interface Material {
  id: string;
  store_id: string;
  name: string;
  description: string;
  composition: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialCreateData {
  store_id: string;
  name: string;
  description: string;
  composition: string;
}

export interface MaterialUpdateData extends MaterialCreateData {}

// API client
export const clothingsApi = {
  // Colors
  getColors: async (storeId: string): Promise<Color[]> => {
    console.log(`Fetching colors from /clothings/stores/${storeId}/colors/`);
    try {
      const response = await coreApiClient.get<Color[]>(`/clothings/stores/${storeId}/colors/`);
      console.log('Colors fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },
  
  getColor: async (storeId: string, id: string): Promise<Color> => {
    console.log(`Fetching color with ID ${id} from /clothings/stores/${storeId}/colors/${id}/`);
    try {
      const response = await coreApiClient.get<Color>(`/clothings/stores/${storeId}/colors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching color with ID ${id}:`, error);
      throw error;
    }
  },
  
  createColor: async (storeId: string, data: ColorCreateData): Promise<Color> => {
    console.log('Creating color with data:', data);
    try {
      const response = await coreApiClient.post<Color>(`/clothings/stores/${storeId}/colors/`, data);
      console.log('Color created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  },
  
  updateColor: async (storeId: string, id: string, data: ColorUpdateData): Promise<Color> => {
    console.log(`Updating color with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Color>(`/clothings/stores/${storeId}/colors/${id}/`, data);
      console.log('Color updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating color with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteColor: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting color with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/stores/${storeId}/colors/${id}/`);
      console.log('Color deleted successfully');
    } catch (error) {
      console.error(`Error deleting color with ID ${id}:`, error);
      throw error;
    }
  },

  // Seasons
  getSeasons: async (storeId: string): Promise<Season[]> => {
    console.log(`Fetching seasons from /clothings/stores/${storeId}/seasons/`);
    try {
      const response = await coreApiClient.get<Season[]>(`/clothings/stores/${storeId}/seasons/`);
      console.log('Seasons fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching seasons:', error);
      throw error;
    }
  },
  
  getSeason: async (storeId: string, id: string): Promise<Season> => {
    console.log(`Fetching season with ID ${id} from /clothings/stores/${storeId}/seasons/${id}/`);
    try {
      const response = await coreApiClient.get<Season>(`/clothings/stores/${storeId}/seasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching season with ID ${id}:`, error);
      throw error;
    }
  },
  
  createSeason: async (storeId: string, data: SeasonCreateData): Promise<Season> => {
    console.log('Creating season with data:', data);
    try {
      const response = await coreApiClient.post<Season>(`/clothings/stores/${storeId}/seasons/`, data);
      console.log('Season created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating season:', error);
      throw error;
    }
  },
  
  updateSeason: async (storeId: string, id: string, data: SeasonUpdateData): Promise<Season> => {
    console.log(`Updating season with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Season>(`/clothings/stores/${storeId}/seasons/${id}/`, data);
      console.log('Season updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating season with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteSeason: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting season with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/stores/${storeId}/seasons/${id}/`);
      console.log('Season deleted successfully');
    } catch (error) {
      console.error(`Error deleting season with ID ${id}:`, error);
      throw error;
    }
  },

  // Collections
  getCollections: async (storeId: string): Promise<Collection[]> => {
    console.log(`Fetching collections from /clothings/stores/${storeId}/collections/`);
    try {
      const response = await coreApiClient.get<Collection[]>(`/clothings/stores/${storeId}/collections/`);
      console.log('Collections fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },
  
  getCollection: async (storeId: string, id: string): Promise<Collection> => {
    console.log(`Fetching collection with ID ${id} from /clothings/stores/${storeId}/collections/${id}/`);
    try {
      const response = await coreApiClient.get<Collection>(`/clothings/stores/${storeId}/collections/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  createCollection: async (storeId: string, data: CollectionCreateData): Promise<Collection> => {
    console.log('Creating collection with data:', data);
    try {
      const response = await coreApiClient.post<Collection>(`/clothings/stores/${storeId}/collections/`, data);
      console.log('Collection created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },
  
  updateCollection: async (storeId: string, id: string, data: CollectionUpdateData): Promise<Collection> => {
    console.log(`Updating collection with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Collection>(`/clothings/stores/${storeId}/collections/${id}/`, data);
      console.log('Collection updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteCollection: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting collection with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/stores/${storeId}/collections/${id}/`);
      console.log('Collection deleted successfully');
    } catch (error) {
      console.error(`Error deleting collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Sizes
  getSizes: async (storeId: string): Promise<Size[]> => {
    console.log(`Fetching sizes from /clothings/stores/${storeId}/sizes/`);
    try {
      const response = await coreApiClient.get<Size[]>(`/clothings/stores/${storeId}/sizes/`);
      console.log('Sizes fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  },
  
  getSize: async (storeId: string, id: string): Promise<Size> => {
    console.log(`Fetching size with ID ${id} from /clothings/stores/${storeId}/sizes/${id}/`);
    try {
      const response = await coreApiClient.get<Size>(`/clothings/stores/${storeId}/sizes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching size with ID ${id}:`, error);
      throw error;
    }
  },
  
  createSize: async (storeId: string, data: SizeCreateData): Promise<Size> => {
    console.log('Creating size with data:', data);
    try {
      const response = await coreApiClient.post<Size>(`/clothings/stores/${storeId}/sizes/`, data);
      console.log('Size created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating size:', error);
      throw error;
    }
  },
  
  updateSize: async (storeId: string, id: string, data: SizeUpdateData): Promise<Size> => {
    console.log(`Updating size with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Size>(`/clothings/stores/${storeId}/sizes/${id}/`, data);
      console.log('Size updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating size with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteSize: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting size with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/stores/${storeId}/sizes/${id}/`);
      console.log('Size deleted successfully');
    } catch (error) {
      console.error(`Error deleting size with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Materials
  getMaterials: async (storeId: string): Promise<Material[]> => {
    console.log(`Fetching materials from /clothings/stores/${storeId}/materials/`);
    try {
      const response = await coreApiClient.get<Material[]>(`/clothings/stores/${storeId}/materials/`);
      console.log('Materials fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },
  
  getMaterial: async (storeId: string, id: string): Promise<Material> => {
    console.log(`Fetching material with ID ${id} from /clothings/stores/${storeId}/materials/${id}/`);
    try {
      const response = await coreApiClient.get<Material>(`/clothings/stores/${storeId}/materials/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material with ID ${id}:`, error);
      throw error;
    }
  },
  
  createMaterial: async (storeId: string, data: MaterialCreateData): Promise<Material> => {
    console.log('Creating material with data:', data);
    try {
      const response = await coreApiClient.post<Material>(`/clothings/stores/${storeId}/materials/`, data);
      console.log('Material created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  },
  
  updateMaterial: async (storeId: string, id: string, data: MaterialUpdateData): Promise<Material> => {
    console.log(`Updating material with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Material>(`/clothings/stores/${storeId}/materials/${id}/`, data);
      console.log('Material updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating material with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteMaterial: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting material with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/stores/${storeId}/materials/${id}/`);
      console.log('Material deleted successfully');
    } catch (error) {
      console.error(`Error deleting material with ID ${id}:`, error);
      throw error;
    }
  }
}; 