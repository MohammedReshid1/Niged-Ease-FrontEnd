import { fetchApi } from '@/utils/api';
import tokenStorage from '@/utils/token-storage';

export interface PredictionResponse {
  company_id: string;
  store_id?: string;
  metric_predicted: string;
  projection_method: string;
  num_projected_months: number;
  projections: {
    date: string;
    predicted_value: number;
  }[];
}

const getAuthHeaders = () => {
  const token = tokenStorage.getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const predictionsApi = {
  getCompanyCustomerPredictions: async (companyId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/companies/${companyId}/predictions/customers/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  getCompanyProfitPredictions: async (companyId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/companies/${companyId}/predictions/profit/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  getCompanyRevenuePredictions: async (companyId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/companies/${companyId}/predictions/revenue/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  getStoreCustomerPredictions: async (storeId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/stores/${storeId}/predictions/customers/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  getStoreProfitPredictions: async (storeId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/stores/${storeId}/predictions/profit/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  getStoreRevenuePredictions: async (storeId: string) => {
    return fetchApi<PredictionResponse>(`/api/predictions/stores/${storeId}/predictions/revenue/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  }
};
