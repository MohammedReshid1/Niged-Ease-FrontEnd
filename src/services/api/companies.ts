import { coreApiClient } from './client';
import { usersApi } from './users';
import { inventoryApi } from './inventory';

// Types
export interface Currency {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyCreateData {
  name: string;
  code: string;
}

export interface CurrencyUpdateData extends Partial<CurrencyCreateData> {}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features: any; // This can be typed more specifically if needed
  is_active: boolean;
  storage_limit_gb: number;
  max_products: number;
  max_stores: number;
  max_customers: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionCheckResponse {
  current_users_count: number;
  max_customers: number;
  current_stores_count: number;
  max_stores: number;
  current_products_count: number;
  max_products: number;
  current_storage_usage_gb: number;
  storage_limit_gb: number;
  subscription_plan: SubscriptionPlan;
}

export interface SubscriptionPlanCreateData {
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features?: any;
  is_active?: boolean;
  storage_limit_gb?: number;
  max_products?: number;
  max_stores?: number;
  max_customers?: number;
}

export interface SubscriptionPlanUpdateData extends Partial<SubscriptionPlanCreateData> {}

export interface Company {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_subscribed: string;
  subscription_plan: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateData {
  name: string;
  description: string;
  is_active?: boolean;
  subscription_plan?: string;
}

export interface CompanyUpdateData extends CompanyCreateData {}

export interface Store {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: "active" | "inactive";
  company?: Company;
}

export interface StoreCreateData {
  company_id: string;
  name: string;
  location: string;
  is_active?: "active" | "inactive";
}

export interface StoreUpdateData extends StoreCreateData {}

// Companies API
export const companiesApi = {
  // Get all companies
  getCompanies: async (): Promise<Company[]> => {
    const response = await coreApiClient.get<Company[]>('/companies/companies/');
    return response.data;
  },
  
  // Get company by ID
  getCompany: async (id: string): Promise<Company> => {
    const response = await coreApiClient.get<Company>(`/companies/companies/${id}/`);
    return response.data;
  },
  
  // Create a new company
  createCompany: async (data: CompanyCreateData): Promise<Company> => {
    const response = await coreApiClient.post<Company>('/companies/companies/', data);
    return response.data;
  },
  
  // Update a company
  updateCompany: async (id: string, data: CompanyUpdateData): Promise<Company> => {
    const response = await coreApiClient.put<Company>(`/companies/companies/${id}/`, data);
    return response.data;
  },
  
  // Delete a company
  deleteCompany: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/companies/${id}/`);
  },
  
  // Check company subscription
  checkCompanySubscription: async (id: string): Promise<SubscriptionCheckResponse> => {
    try {
      // Try the proper endpoint first
      const response = await coreApiClient.get(`/companies/companies/${id}/subscription/check/`);
      return response.data as SubscriptionCheckResponse;
    } catch (error) {
      console.error(`Error checking company subscription for ID ${id}:`, error);
      
      // If the endpoint fails, manually construct the subscription check from available data
      try {
        // Get the company to find its subscription plan
        const company = await companiesApi.getCompany(id);
        
        if (!company.subscription_plan) {
          throw new Error('Company has no subscription plan');
        }
        
        // Get subscription plan details
        const subscriptionPlan = await companiesApi.getSubscriptionPlan(company.subscription_plan);
        
        // Get users count for this company
        const users = await usersApi.getUsers();
        const companyUsers = users.filter(user => user.company_id === id);
        
        // Get stores count for this company
        const stores = await inventoryApi.getStores(id);
        
        // Get products count for this company
        let totalProducts = 0;
        for (const store of stores) {
          const products = await inventoryApi.getProducts(store.id);
          totalProducts += products.length;
        }
        
        // Create and return a subscription check response
        return {
          current_users_count: companyUsers.length,
          max_customers: subscriptionPlan.max_customers,
          current_stores_count: stores.length,
          max_stores: subscriptionPlan.max_stores,
          current_products_count: totalProducts,
          max_products: subscriptionPlan.max_products,
          current_storage_usage_gb: 0, // Placeholder, update if you have a way to track storage usage
          storage_limit_gb: subscriptionPlan.storage_limit_gb,
          subscription_plan: subscriptionPlan,
        };
      } catch (secondError) {
        console.error('Fallback subscription check method also failed:', secondError);
        
        // Create a default response if all else fails
        const defaultPlan: SubscriptionPlan = {
          id: 'default',
          name: 'Default Plan',
          description: 'Default plan when API fails',
          price: '0',
          billing_cycle: 'monthly' as const,
          duration_in_months: 1,
          features: null,
          is_active: true,
          storage_limit_gb: 5,
          max_products: 100,
          max_stores: 5,
          max_customers: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return {
          current_users_count: 0,
          max_customers: defaultPlan.max_customers,
          current_stores_count: 0,
          max_stores: defaultPlan.max_stores,
          current_products_count: 0,
          max_products: defaultPlan.max_products,
          current_storage_usage_gb: 0,
          storage_limit_gb: defaultPlan.storage_limit_gb,
          subscription_plan: defaultPlan,
        };
      }
    }
  },
  
  // Renew company subscription
  renewCompanySubscription: async (id: string, data: any): Promise<any> => {
    const response = await coreApiClient.post(`/companies/companies/${id}/subscription/renew/`, data);
    return response.data;
  },
  
  // Get all currencies
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await coreApiClient.get<Currency[]>('/companies/currencies/');
    return response.data;
  },
  
  // Get currency by ID
  getCurrency: async (id: string): Promise<Currency> => {
    const response = await coreApiClient.get<Currency>(`/companies/currencies/${id}/`);
    return response.data;
  },
  
  // Create a new currency
  createCurrency: async (data: CurrencyCreateData): Promise<Currency> => {
    const response = await coreApiClient.post<Currency>('/companies/currencies/', data);
    return response.data;
  },
  
  // Update a currency
  updateCurrency: async (id: string, data: CurrencyUpdateData): Promise<Currency> => {
    const response = await coreApiClient.put<Currency>(`/companies/currencies/${id}/`, data);
    return response.data;
  },
  
  // Partially update a currency (PATCH)
  patchCurrency: async (id: string, data: CurrencyUpdateData): Promise<Currency> => {
    const response = await coreApiClient.patch<Currency>(`/companies/currencies/${id}/`, data);
    return response.data;
  },
  
  // Delete a currency
  deleteCurrency: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/currencies/${id}/`);
  },
  
  // Get all stores for a company
  getStores: async (companyId: string): Promise<Store[]> => {
    const response = await coreApiClient.get<Store[]>(`/companies/companies/${companyId}/stores/`);
    return response.data;
  },
  
  // Get store by ID
  getStore: async (companyId: string, id: string): Promise<Store> => {
    const response = await coreApiClient.get<Store>(`/companies/companies/${companyId}/stores/${id}/`);
    return response.data;
  },
  
  // Create a new store
  createStore: async (companyId: string, data: StoreCreateData): Promise<Store> => {
    const response = await coreApiClient.post<Store>(`/companies/companies/${companyId}/stores/`, data);
    return response.data;
  },
  
  // Update a store
  updateStore: async (companyId: string, id: string, data: StoreUpdateData): Promise<Store> => {
    const response = await coreApiClient.put<Store>(`/companies/companies/${companyId}/stores/${id}/`, data);
    return response.data;
  },
  
  // Delete a store
  deleteStore: async (companyId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/companies/${companyId}/stores/${id}/`);
  },
  
  // Get all subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await coreApiClient.get<SubscriptionPlan[]>('/companies/subscription-plans/');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      
      // Return empty array if API fails
      return [];
    }
  },
  
  // Get subscription plan by ID
  getSubscriptionPlan: async (id: string): Promise<SubscriptionPlan> => {
    try {
      // First try the direct endpoint
      const response = await coreApiClient.get<SubscriptionPlan>(`/companies/subscription-plans/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription plan with ID ${id}:`, error);
      
      // If direct endpoint fails, try to get all plans and find the one we need
      try {
        const response = await coreApiClient.get<SubscriptionPlan[]>('/companies/subscription-plans/');
        const plan = response.data.find(plan => plan.id === id);
        
        if (plan) {
          return plan;
        }
        
        throw new Error(`Subscription plan with ID ${id} not found`);
      } catch (secondError) {
        console.error('Fallback method also failed:', secondError);
        
        // If all fails, return a default plan
        return {
          id: id,
          name: 'Default Plan',
          description: 'Default plan when API fails',
          price: '0',
          billing_cycle: 'monthly' as const,
          duration_in_months: 1,
          features: null,
          is_active: true,
          storage_limit_gb: 5,
          max_products: 100,
          max_stores: 5,
          max_customers: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    }
  },
  
  // Create a new subscription plan
  createSubscriptionPlan: async (data: SubscriptionPlanCreateData): Promise<SubscriptionPlan> => {
    try {
      const response = await coreApiClient.post<SubscriptionPlan>('/companies/subscription-plans/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  },
  
  // Update a subscription plan
  updateSubscriptionPlan: async (
    id: string,
    data: SubscriptionPlanUpdateData
  ): Promise<SubscriptionPlan> => {
    try {
      const response = await coreApiClient.put<SubscriptionPlan>(`/companies/subscription-plans/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription plan with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Partially update a subscription plan (PATCH)
  patchSubscriptionPlan: async (
    id: string,
    data: SubscriptionPlanUpdateData
  ): Promise<SubscriptionPlan> => {
    try {
      const response = await coreApiClient.patch<SubscriptionPlan>(`/companies/subscription-plans/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error patching subscription plan with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a subscription plan
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    try {
      await coreApiClient.delete(`/companies/subscription-plans/${id}/`);
    } catch (error) {
      console.error(`Error deleting subscription plan with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a company and all related data
  deleteCompanyWithRelatedData: async (id: string): Promise<void> => {
    try {
      // 1. Get all users for this company
      const users = await usersApi.getUsers();
      const companyUsers = users.filter(user => user.company_id === id);
      
      // 2. Delete all users associated with the company
      await Promise.all(companyUsers.map(user => usersApi.deleteUser(user.id)));
      
      // 3. Get all stores for this company - using company-specific endpoint
      const stores = await inventoryApi.getStores(id);
      
      // 4. Delete all stores associated with the company - using direct endpoint
      for (const store of stores) {
        try {
          // Delete store using the correct endpoint with company ID
          await coreApiClient.delete(`/companies/companies/${id}/stores/${store.id}/`);
        } catch (storeError) {
          console.error(`Error deleting store ${store.id}:`, storeError);
          // Continue with other stores even if one fails
        }
      }
      
      // 5. Finally delete the company
      await coreApiClient.delete(`/companies/companies/${id}/`);
    } catch (error) {
      console.error('Error in cascade deletion:', error);
      throw error;
    }
  },
}; 