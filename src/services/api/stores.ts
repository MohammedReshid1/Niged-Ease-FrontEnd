import tokenStorage from '@/utils/token-storage';

import { coreApiClient } from './client';

export interface Store {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreCreateData {
  name: string;
  address: string;
  company_id: string;
  is_active: boolean;
  location: string;
}

export interface StoreUpdateData extends Partial<StoreCreateData> {}

// Stores API
export const storesApi = {
  // Get all stores
  getStores: async (companyId?: string): Promise<Store[]> => {
    try {
      // If no companyId is provided, try to get it from token storage
      if (!companyId) {
        const userInfo = tokenStorage.getUserInfo();
        companyId = userInfo?.company_id;

        if (!companyId) {
          throw new Error('Company ID is required to fetch stores');
        }
      }

      const response = await coreApiClient.get<Store[]>(`/companies/companies/${companyId}/stores/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },

  // Get store by ID
  getStore: async (id: string): Promise<Store> => {
    try {
      // First try to get the store information to identify its company
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;

      if (!companyId) {
        throw new Error('Company ID is required to fetch store');
      }

      const response = await coreApiClient.get<Store>(`/companies/companies/${companyId}/stores/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting store:', error);
      throw error;
    }
  },

  // Create a new store
  createStore: async (data: StoreCreateData): Promise<Store> => {
    try {
      const companyId = data.company_id;
      if (!companyId) {
        throw new Error('Company ID is required to create a store');
      }

      const response = await coreApiClient.post<Store>(`/companies/companies/${companyId}/stores/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  // Update a store
  updateStore: async (id: string, data: StoreUpdateData): Promise<Store> => {
    try {
      const companyId = data.company_id;
      if (!companyId) {
        const userInfo = tokenStorage.getUserInfo();
        const userCompanyId = userInfo?.company_id;

        if (!userCompanyId) {
          throw new Error('Company ID is required to update a store');
        }

        data.company_id = userCompanyId;
      }

      const response = await coreApiClient.put<Store>(`/companies/companies/${data.company_id}/stores/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  // Delete a store
  deleteStore: async (id: string): Promise<void> => {
    try {
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;

      if (!companyId) {
        throw new Error('Company ID is required to delete a store');
      }

      await coreApiClient.delete(`/companies/companies/${companyId}/stores/${id}/`);
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  },

  // Toggle store active status
  toggleStoreStatus: async (id: string, isActive: boolean): Promise<Store> => {
    try {
      const userInfo = tokenStorage.getUserInfo();
      const companyId = userInfo?.company_id;

      if (!companyId) {
        throw new Error('Company ID is required to toggle store status');
      }

      const response = await coreApiClient.put<Store>(`/companies/companies/${companyId}/stores/${id}/`, {
        is_active: isActive ? 'active' : 'inactive',
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling store status:', error);
      throw error;
    }
  },
};
