import { coreApiClient } from './client';

export interface StockTransfer {
  id: string;
  source_store: string;
  destination_store: string;
  product: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStockTransferRequest {
  source_store: string;
  destination_store: string;
  product: string;
  quantity: number;
  notes?: string;
}

export const stockTransfersApi = {
  // Get all transfers for a store
  getStoreTransfers: async (storeId: string): Promise<StockTransfer[]> => {
    const response = await coreApiClient.get<StockTransfer[]>(`/inventory/stores/${storeId}/transfers/`);
    return response.data;
  },

  // Get a specific transfer
  getTransfer: async (storeId: string, transferId: string): Promise<StockTransfer> => {
    const response = await coreApiClient.get<StockTransfer>(`/inventory/stores/${storeId}/transfers/${transferId}/`);
    return response.data;
  },

  // Create a new transfer
  createTransfer: async (storeId: string, data: CreateStockTransferRequest): Promise<StockTransfer> => {
    const response = await coreApiClient.post<StockTransfer>(`/inventory/stores/${storeId}/transfers/`, data);
    return response.data;
  },

  // Update a transfer
  updateTransfer: async (storeId: string, transferId: string, data: CreateStockTransferRequest): Promise<StockTransfer> => {
    const response = await coreApiClient.put<StockTransfer>(`/inventory/stores/${storeId}/transfers/${transferId}/`, data);
    return response.data;
  },

  // Cancel a transfer
  cancelTransfer: async (storeId: string, transferId: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/transfers/${transferId}/`);
  },
}; 