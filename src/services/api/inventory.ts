import { coreApiClient } from './client';
import { Company, Currency, SubscriptionPlan } from './companies';
import tokenStorage from '@/utils/token-storage';

// Inventory Interfaces
export interface ProductUnit {
  id: string;
  store: {
    id: string;
    company: Company;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: "active" | "inactive";
  };
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductUnitCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ProductUnitUpdateData extends ProductUnitCreateData {}

export interface ProductCategory {
  id: string;
  store: {
    id: string;
    company: Company;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: "active" | "inactive";
  };
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ProductCategoryUpdateData extends ProductCategoryCreateData {}

export interface Product {
  id: string;
  store: {
    id: string;
    company: Company;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: "active" | "inactive";
  };
  name: string;
  description: string;
  image: string;
  product_unit: ProductUnit;
  product_category: ProductCategory;
  purchase_price: string;
  sale_price: string;
  color: string;
  collection: string;
  reorder_level?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  store_id: string;
  name: string;
  description: string;
  image?: string;
  product_unit_id: string;
  product_category_id: string;
  purchase_price?: string;
  sale_price?: string;
  color_id?: string;
  collection_id?: string;
}

export interface ProductUpdateData extends ProductCreateData {}

export interface InventoryStore {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: "active" | "inactive";
  company?: Company;
  address?: string;
  phone_number?: string;
  email?: string;
}

export interface InventoryStoreCreateData {
  company_id: string;
  name: string;
  location: string;
  is_active?: "active" | "inactive";
  address?: string;
  phone_number?: string;
  email?: string;
}

export interface InventoryStoreUpdateData extends Partial<InventoryStoreCreateData> {}

export interface Inventory {
  id: string;
  product: Product;
  store: InventoryStore;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryCreateData {
  product_id: string;
  store_id: string;
  quantity: string;
}

export interface InventoryUpdateData extends InventoryCreateData {}

// Clothing Interfaces
export interface ClothingColor {
  id: string;
  store_id: string;
  name: string;
  color_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ClothingColorCreateData {
  store_id: string;
  name: string;
  color_code: string;
}

export interface ClothingColorUpdateData extends ClothingColorCreateData {}

export interface ClothingMaterial {
  id: string;
  store_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingMaterialCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ClothingMaterialUpdateData extends ClothingMaterialCreateData {}

export interface ClothingSize {
  id: string;
  store_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingSizeCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ClothingSizeUpdateData extends ClothingSizeCreateData {}

export interface ClothingSeason {
  id: string;
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingSeasonCreateData {
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface ClothingSeasonUpdateData extends ClothingSeasonCreateData {}

export interface ClothingCollection {
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

export interface ClothingCollectionCreateData {
  store_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
}

export interface ClothingCollectionUpdateData extends ClothingCollectionCreateData {}

export interface InventorySearchResult {
  id: string;
  name: string;
  description: string;
  image: string;
  store: {
    id: string;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: string;
  };
  product_unit: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  product_category: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  purchase_price: string;
  sale_price: string;
  inventory: {
    store_id: string;
    store_name: string;
    store_location: string;
    quantity: number;
  }[];
  created_at: string;
  updated_at: string;
}

// API client
export const inventoryApi = {
  // Product Units
  getProductUnits: async (storeId: string): Promise<ProductUnit[]> => {
    const response = await coreApiClient.get<ProductUnit[]>(`/inventory/stores/${storeId}/product-units/`);
    return response.data;
  },
  
  getProductUnit: async (storeId: string, id: string): Promise<ProductUnit> => {
    const response = await coreApiClient.get<ProductUnit>(`/inventory/stores/${storeId}/product-units/${id}/`);
    return response.data;
  },
  
  createProductUnit: async (storeId: string, data: ProductUnitCreateData): Promise<ProductUnit> => {
    const response = await coreApiClient.post<ProductUnit>(`/inventory/stores/${storeId}/product-units/`, data);
    return response.data;
  },
  
  updateProductUnit: async (storeId: string, id: string, data: ProductUnitUpdateData): Promise<ProductUnit> => {
    const response = await coreApiClient.put<ProductUnit>(`/inventory/stores/${storeId}/product-units/${id}/`, data);
    return response.data;
  },
  
  deleteProductUnit: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/product-units/${id}/`);
  },

  // Product Categories
  getProductCategories: async (storeId: string): Promise<ProductCategory[]> => {
    console.log(`Fetching product categories from /inventory/stores/${storeId}/product-categories/`);
    const response = await coreApiClient.get<ProductCategory[]>(`/inventory/stores/${storeId}/product-categories/`);
    return response.data;
  },
  
  getProductCategory: async (storeId: string, id: string): Promise<ProductCategory> => {
    console.log(`Fetching product category with ID ${id} from /inventory/stores/${storeId}/product-categories/${id}/`);
    const response = await coreApiClient.get<ProductCategory>(`/inventory/stores/${storeId}/product-categories/${id}/`);
    return response.data;
  },
  
  createProductCategory: async (storeId: string, data: ProductCategoryCreateData): Promise<ProductCategory> => {
    console.log('Creating product category with data:', data);
    try {
      const response = await coreApiClient.post<ProductCategory>(`/inventory/stores/${storeId}/product-categories/`, data);
      console.log('Product category created, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating product category:', error);
      throw error;
    }
  },
  
  updateProductCategory: async (storeId: string, id: string, data: ProductCategoryUpdateData): Promise<ProductCategory> => {
    console.log(`Updating product category with ID ${id} and data:`, data);
    const response = await coreApiClient.put<ProductCategory>(`/inventory/stores/${storeId}/product-categories/${id}/`, data);
    return response.data;
  },
  
  deleteProductCategory: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting product category with ID ${id}`);
    await coreApiClient.delete(`/inventory/stores/${storeId}/product-categories/${id}/`);
  },

  // Products
  getProducts: async (storeId: string): Promise<Product[]> => {
    const response = await coreApiClient.get<Product[]>(`/inventory/stores/${storeId}/products/`);
    return response.data;
  },
  
  getProduct: async (storeId: string, id: string): Promise<Product> => {
    const response = await coreApiClient.get<Product>(`/inventory/stores/${storeId}/products/${id}/`);
    return response.data;
  },
  
  createProduct: async (storeId: string, data: ProductCreateData): Promise<Product> => {
    const response = await coreApiClient.post<Product>(`/inventory/stores/${storeId}/products/`, data);
    return response.data;
  },
  
  updateProduct: async (storeId: string, id: string, data: ProductUpdateData): Promise<Product> => {
    const response = await coreApiClient.put<Product>(`/inventory/stores/${storeId}/products/${id}/`, data);
    return response.data;
  },
  
  deleteProduct: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/products/${id}/`);
  },

  // Stores
  getStores: async (companyId?: string): Promise<InventoryStore[]> => {
    try {
      // If no companyId is provided, try to get it from token storage
      if (!companyId) {
        const userInfo = tokenStorage.getUserInfo();
        companyId = userInfo?.company_id;
        
        if (!companyId) {
          throw new Error('Company ID is required to fetch stores');
        }
      }
      
      const endpoint = `/companies/companies/${companyId}/stores/`;
      const response = await coreApiClient.get<InventoryStore[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },
  
  getStore: async (id: string): Promise<InventoryStore> => {
    try {
      // First try to get the company ID from the token storage
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;
      
      if (!companyId) {
        throw new Error('Company ID is required to fetch store');
      }
      
      // Now get the specific store with the company ID
      const response = await coreApiClient.get<InventoryStore>(`/companies/companies/${companyId}/stores/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting store:', error);
      throw error;
    }
  },
  
  createStore: async (data: InventoryStoreCreateData): Promise<InventoryStore> => {
    const response = await coreApiClient.post<InventoryStore>(`/companies/companies/${data.company_id}/stores/`, data);
    return response.data;
  },
  
  updateStore: async (id: string, data: InventoryStoreUpdateData): Promise<InventoryStore> => {
    if (!data.company_id) {
      throw new Error("Company ID is required to update a store");
    }
    const response = await coreApiClient.put<InventoryStore>(`/companies/companies/${data.company_id}/stores/${id}/`, data);
    return response.data;
  },
  
  deleteStore: async (id: string): Promise<void> => {
    try {
      // Get company ID from token storage
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;
      
      if (!companyId) {
        throw new Error('Company ID is required to delete store');
      }
      
      await coreApiClient.delete(`/companies/companies/${companyId}/stores/${id}/`);
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  },

  toggleStoreStatus: async (id: string, isActive: boolean): Promise<InventoryStore> => {
    try {
      // Get company ID from token storage
      console.log(`Toggling store ${id} status to ${isActive ? 'active' : 'inactive'}`);
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;
      
      if (!companyId) {
        throw new Error('Company ID is required to toggle store status');
      }
      
      // First get the store details to preserve other data
      const storeResponse = await coreApiClient.get<InventoryStore>(`/companies/companies/${companyId}/stores/${id}/`);
      const store = storeResponse.data;
      
      // Now update just the is_active field while preserving other fields
      // The API expects "active" or "inactive" strings, not boolean values
      const updateData: InventoryStoreUpdateData = {
        company_id: companyId,
        name: store.name,
        location: store.location,
        address: store.address,
        phone_number: store.phone_number,
        email: store.email,
        is_active: isActive ? "active" : "inactive"
      };
      
      console.log('Updating store with data:', updateData);
      const response = await coreApiClient.put<InventoryStore>(
        `/companies/companies/${companyId}/stores/${id}/`, 
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling store status:', error);
      throw error;
    }
  },

  // Inventory
  getInventories: async (storeId: string): Promise<Inventory[]> => {
    const response = await coreApiClient.get<Inventory[]>(`/inventory/stores/${storeId}/inventories/`);
    return response.data;
  },
  
  getInventory: async (storeId: string, id: string): Promise<Inventory> => {
    const response = await coreApiClient.get<Inventory>(`/inventory/stores/${storeId}/inventories/${id}/`);
    return response.data;
  },
  
  createInventory: async (storeId: string, data: InventoryCreateData): Promise<Inventory> => {
    const response = await coreApiClient.post<Inventory>(`/inventory/stores/${storeId}/inventories/`, data);
    return response.data;
  },
  
  updateInventory: async (storeId: string, id: string, data: InventoryUpdateData): Promise<Inventory> => {
    const response = await coreApiClient.put<Inventory>(`/inventory/stores/${storeId}/inventories/${id}/`, data);
    return response.data;
  },
  
  deleteInventory: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/inventories/${id}/`);
  },

  // Clothing Colors
  getClothingColors: async (storeId: string): Promise<ClothingColor[]> => {
    const response = await coreApiClient.get<ClothingColor[]>(`/clothings/stores/${storeId}/colors/`);
    return response.data;
  },
  
  getClothingColor: async (storeId: string, id: string): Promise<ClothingColor> => {
    const response = await coreApiClient.get<ClothingColor>(`/clothings/stores/${storeId}/colors/${id}/`);
    return response.data;
  },
  
  createClothingColor: async (storeId: string, data: ClothingColorCreateData): Promise<ClothingColor> => {
    const response = await coreApiClient.post<ClothingColor>(`/clothings/stores/${storeId}/colors/`, data);
    return response.data;
  },
  
  updateClothingColor: async (storeId: string, id: string, data: ClothingColorUpdateData): Promise<ClothingColor> => {
    const response = await coreApiClient.put<ClothingColor>(`/clothings/stores/${storeId}/colors/${id}/`, data);
    return response.data;
  },
  
  deleteClothingColor: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/clothings/stores/${storeId}/colors/${id}/`);
  },

  // Clothing Materials
  getClothingMaterials: async (storeId: string): Promise<ClothingMaterial[]> => {
    const response = await coreApiClient.get<ClothingMaterial[]>(`/clothings/stores/${storeId}/materials/`);
    return response.data;
  },
  
  getClothingMaterial: async (storeId: string, id: string): Promise<ClothingMaterial> => {
    const response = await coreApiClient.get<ClothingMaterial>(`/clothings/stores/${storeId}/materials/${id}/`);
    return response.data;
  },
  
  createClothingMaterial: async (storeId: string, data: ClothingMaterialCreateData): Promise<ClothingMaterial> => {
    const response = await coreApiClient.post<ClothingMaterial>(`/clothings/stores/${storeId}/materials/`, data);
    return response.data;
  },
  
  updateClothingMaterial: async (storeId: string, id: string, data: ClothingMaterialUpdateData): Promise<ClothingMaterial> => {
    const response = await coreApiClient.put<ClothingMaterial>(`/clothings/stores/${storeId}/materials/${id}/`, data);
    return response.data;
  },
  
  deleteClothingMaterial: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/clothings/stores/${storeId}/materials/${id}/`);
  },

  // Clothing Sizes
  getClothingSizes: async (storeId: string): Promise<ClothingSize[]> => {
    const response = await coreApiClient.get<ClothingSize[]>(`/clothings/stores/${storeId}/sizes/`);
    return response.data;
  },
  
  getClothingSize: async (storeId: string, id: string): Promise<ClothingSize> => {
    const response = await coreApiClient.get<ClothingSize>(`/clothings/stores/${storeId}/sizes/${id}/`);
    return response.data;
  },
  
  createClothingSize: async (storeId: string, data: ClothingSizeCreateData): Promise<ClothingSize> => {
    const response = await coreApiClient.post<ClothingSize>(`/clothings/stores/${storeId}/sizes/`, data);
    return response.data;
  },
  
  updateClothingSize: async (storeId: string, id: string, data: ClothingSizeUpdateData): Promise<ClothingSize> => {
    const response = await coreApiClient.put<ClothingSize>(`/clothings/stores/${storeId}/sizes/${id}/`, data);
    return response.data;
  },
  
  deleteClothingSize: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/clothings/stores/${storeId}/sizes/${id}/`);
  },

  // Clothing Seasons
  getClothingSeasons: async (storeId: string): Promise<ClothingSeason[]> => {
    const response = await coreApiClient.get<ClothingSeason[]>(`/clothings/stores/${storeId}/seasons/`);
    return response.data;
  },
  
  getClothingSeason: async (storeId: string, id: string): Promise<ClothingSeason> => {
    const response = await coreApiClient.get<ClothingSeason>(`/clothings/stores/${storeId}/seasons/${id}/`);
    return response.data;
  },
  
  createClothingSeason: async (storeId: string, data: ClothingSeasonCreateData): Promise<ClothingSeason> => {
    const response = await coreApiClient.post<ClothingSeason>(`/clothings/stores/${storeId}/seasons/`, data);
    return response.data;
  },
  
  updateClothingSeason: async (storeId: string, id: string, data: ClothingSeasonUpdateData): Promise<ClothingSeason> => {
    const response = await coreApiClient.put<ClothingSeason>(`/clothings/stores/${storeId}/seasons/${id}/`, data);
    return response.data;
  },
  
  deleteClothingSeason: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/clothings/stores/${storeId}/seasons/${id}/`);
  },

  // Clothing Collections
  getClothingCollections: async (storeId: string): Promise<ClothingCollection[]> => {
    const response = await coreApiClient.get<ClothingCollection[]>(`/clothings/stores/${storeId}/collections/`);
    return response.data;
  },
  
  getClothingCollection: async (storeId: string, id: string): Promise<ClothingCollection> => {
    const response = await coreApiClient.get<ClothingCollection>(`/clothings/stores/${storeId}/collections/${id}/`);
    return response.data;
  },
  
  createClothingCollection: async (storeId: string, data: ClothingCollectionCreateData): Promise<ClothingCollection> => {
    const response = await coreApiClient.post<ClothingCollection>(`/clothings/stores/${storeId}/collections/`, data);
    return response.data;
  },
  
  updateClothingCollection: async (storeId: string, id: string, data: ClothingCollectionUpdateData): Promise<ClothingCollection> => {
    const response = await coreApiClient.put<ClothingCollection>(`/clothings/stores/${storeId}/collections/${id}/`, data);
    return response.data;
  },
  
  deleteClothingCollection: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/clothings/stores/${storeId}/collections/${id}/`);
  },

  // Search products across all stores
  searchProducts: async (companyId: string, searchTerm: string): Promise<InventorySearchResult[]> => {
    const response = await coreApiClient.get<InventorySearchResult[]>(`/inventory/companies/${companyId}/product-search/${encodeURIComponent(searchTerm)}/`);
    return response.data;
  },
}; 