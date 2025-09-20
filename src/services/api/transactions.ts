import { coreApiClient } from './client';
import { Company, Currency } from './companies';
import { Product } from './inventory';

// Customer Interfaces
export interface Customer {
  id: string;
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateData {
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerUpdateData extends CustomerCreateData {}

// Payment Mode Interfaces
export interface PaymentMode {
  id: string;
  store_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentModeCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface PaymentModeUpdateData extends PaymentModeCreateData {}

// Supplier Interfaces
export interface Supplier {
  id: string;
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierCreateData {
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active?: boolean;
}

export interface SupplierUpdateData extends SupplierCreateData {}

// Store Interface (for nested objects)
export interface TransactionStore {
  id: string;
  company: Company;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: 'active' | 'inactive';
}

// Purchase Interfaces
export interface Purchase {
  id: string;
  store: TransactionStore;
  supplier: Supplier;
  total_amount: string;
  tax: string;
  amount_paid: string;
  amount: string;
  currency: Currency;
  payment_mode: PaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface PurchaseCreateData {
  store_id: string;
  supplier_id: string;
  total_amount: string;
  tax: string;
  amount_paid: string;
  amount: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: Record<string, string>[];
}

export interface PurchaseUpdateData extends PurchaseCreateData {}

// Purchase Item Interfaces
export interface PurchaseItem {
  id: string;
  purchase: Purchase;
  product: Product;
  quantity: string;
  item_purchase_price: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItemCreateData {
  purchase_id: string;
  product_id: string;
  quantity: string;
  item_purchase_price: string;
}

export interface PurchaseItemUpdateData extends PurchaseItemCreateData {}

// Sales Interfaces
export interface Sale {
  id: string;
  store: TransactionStore;
  customer: Customer;
  total_amount: string;
  tax: string;
  amount_paid: string;
  currency: Currency;
  payment_mode: PaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface SaleCreateData {
  store_id: string;
  customer_id: string;
  total_amount: string;
  tax: string;
  amount_paid: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: Record<string, string>[];
}

export interface SaleUpdateData extends SaleCreateData {}

// Sale Item Interfaces
export interface SaleItem {
  id: string;
  product: Product;
  quantity: string;
  item_sale_price: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItemCreateData {
  sale: string;
  product_id: string;
  quantity: string;
  item_sale_price: string;
}

export interface SaleItemUpdateData extends SaleItemCreateData {}

// API client
export const transactionsApi = {
  // Customers
  getCustomers: async (storeId: string): Promise<Customer[]> => {
    const response = await coreApiClient.get<Customer[]>(`/transactions/stores/${storeId}/customers/`);
    return response.data;
  },

  getCustomer: async (storeId: string, id: string): Promise<Customer> => {
    const response = await coreApiClient.get<Customer>(`/transactions/stores/${storeId}/customers/${id}/`);
    return response.data;
  },

  createCustomer: async (storeId: string, data: CustomerCreateData): Promise<Customer> => {
    const response = await coreApiClient.post<Customer>(`/transactions/stores/${storeId}/customers/`, data);
    return response.data;
  },

  updateCustomer: async (storeId: string, id: string, data: CustomerUpdateData): Promise<Customer> => {
    const response = await coreApiClient.put<Customer>(`/transactions/stores/${storeId}/customers/${id}/`, data);
    return response.data;
  },

  deleteCustomer: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/customers/${id}/`);
  },

  // Payment Modes
  getPaymentModes: async (storeId: string): Promise<PaymentMode[]> => {
    try {
      const response = await coreApiClient.get<PaymentMode[]>(`/transactions/stores/${storeId}/payment-modes/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment modes:', error);
      throw error;
    }
  },

  getPaymentMode: async (storeId: string, id: string): Promise<PaymentMode> => {
    try {
      const response = await coreApiClient.get<PaymentMode>(`/transactions/stores/${storeId}/payment-modes/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment mode:', error);
      throw error;
    }
  },

  createPaymentMode: async (storeId: string, data: PaymentModeCreateData): Promise<PaymentMode> => {
    try {
      const response = await coreApiClient.post<PaymentMode>(`/transactions/stores/${storeId}/payment-modes/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment mode:', error);
      throw error;
    }
  },

  updatePaymentMode: async (storeId: string, id: string, data: PaymentModeUpdateData): Promise<PaymentMode> => {
    try {
      const response = await coreApiClient.put<PaymentMode>(
        `/transactions/stores/${storeId}/payment-modes/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating payment mode:', error);
      throw error;
    }
  },

  deletePaymentMode: async (storeId: string, id: string): Promise<void> => {
    try {
      await coreApiClient.delete(`/transactions/stores/${storeId}/payment-modes/${id}/`);
    } catch (error) {
      console.error('Error deleting payment mode:', error);
      throw error;
    }
  },

  // Purchases
  getPurchases: async (storeId: string): Promise<Purchase[]> => {
    const response = await coreApiClient.get<Purchase[]>(`/transactions/stores/${storeId}/purchases/`);
    return response.data;
  },

  getPurchase: async (storeId: string, id: string): Promise<Purchase> => {
    const response = await coreApiClient.get<Purchase>(`/transactions/stores/${storeId}/purchases/${id}/`);
    return response.data;
  },

  createPurchase: async (storeId: string, data: PurchaseCreateData): Promise<Purchase> => {
    const response = await coreApiClient.post<Purchase>(`/transactions/stores/${storeId}/purchases/`, data);
    return response.data;
  },

  updatePurchase: async (storeId: string, id: string, data: PurchaseUpdateData): Promise<Purchase> => {
    const response = await coreApiClient.put<Purchase>(`/transactions/stores/${storeId}/purchases/${id}/`, data);
    return response.data;
  },

  deletePurchase: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/purchases/${id}/`);
  },

  // Purchase Items
  getPurchaseItems: async (storeId: string, purchaseId: string): Promise<PurchaseItem[]> => {
    const response = await coreApiClient.get<PurchaseItem[]>(
      `/transactions/stores/${storeId}/purchases/${purchaseId}/items/`
    );
    return response.data;
  },

  getPurchaseItem: async (storeId: string, purchaseId: string, itemId: number): Promise<PurchaseItem> => {
    const response = await coreApiClient.get<PurchaseItem>(
      `/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`
    );
    return response.data;
  },

  createPurchaseItem: async (
    storeId: string,
    purchaseId: string,
    data: PurchaseItemCreateData
  ): Promise<PurchaseItem> => {
    const response = await coreApiClient.post<PurchaseItem>(
      `/transactions/stores/${storeId}/purchases/${purchaseId}/items/`,
      data
    );
    return response.data;
  },

  updatePurchaseItem: async (
    storeId: string,
    purchaseId: string,
    itemId: number,
    data: PurchaseItemUpdateData
  ): Promise<PurchaseItem> => {
    const response = await coreApiClient.put<PurchaseItem>(
      `/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`,
      data
    );
    return response.data;
  },

  deletePurchaseItem: async (storeId: string, purchaseId: string, itemId: number): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`);
  },

  // Sales
  getSales: async (storeId: string): Promise<Sale[]> => {
    const response = await coreApiClient.get<Sale[]>(`/transactions/stores/${storeId}/sales/`);
    return response.data;
  },

  getSale: async (storeId: string, id: string): Promise<Sale> => {
    const response = await coreApiClient.get<Sale>(`/transactions/stores/${storeId}/sales/${id}/`);
    return response.data;
  },

  createSale: async (storeId: string, data: SaleCreateData): Promise<Sale> => {
    try {
      console.log('Calling API to create sale with data:', JSON.stringify(data));
      const response = await coreApiClient.post<Sale>(`/transactions/stores/${storeId}/sales/`, data);
      console.log('Sale created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating sale:', error);
      // Log more detailed error information if available
      if (error.response) {
        console.error('API Response Status:', error.response.status);
        console.error('API Response Data:', error.response.data);
      }
      throw error;
    }
  },

  updateSale: async (storeId: string, id: string, data: SaleUpdateData): Promise<Sale> => {
    const response = await coreApiClient.put<Sale>(`/transactions/stores/${storeId}/sales/${id}/`, data);
    return response.data;
  },

  deleteSale: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/sales/${id}/`);
  },

  // Sale Items
  getSaleItems: async (storeId: string, saleId: string): Promise<SaleItem[]> => {
    const response = await coreApiClient.get<SaleItem[]>(`/transactions/stores/${storeId}/sales/${saleId}/items/`);
    return response.data;
  },

  getSaleItem: async (storeId: string, saleId: string, itemId: number): Promise<SaleItem> => {
    const response = await coreApiClient.get<SaleItem>(
      `/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`
    );
    return response.data;
  },

  createSaleItem: async (storeId: string, saleId: string, data: SaleItemCreateData): Promise<SaleItem> => {
    const response = await coreApiClient.post<SaleItem>(`/transactions/stores/${storeId}/sales/${saleId}/items/`, data);
    return response.data;
  },

  updateSaleItem: async (
    storeId: string,
    saleId: string,
    itemId: number,
    data: SaleItemUpdateData
  ): Promise<SaleItem> => {
    const response = await coreApiClient.put<SaleItem>(
      `/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`,
      data
    );
    return response.data;
  },

  deleteSaleItem: async (storeId: string, saleId: string, itemId: number): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`);
  },

  // Suppliers
  getSuppliers: async (storeId: string): Promise<Supplier[]> => {
    const response = await coreApiClient.get<Supplier[]>(`/transactions/stores/${storeId}/suppliers/`);
    return response.data;
  },

  getSupplier: async (storeId: string, id: string): Promise<Supplier> => {
    const response = await coreApiClient.get<Supplier>(`/transactions/stores/${storeId}/suppliers/${id}/`);
    return response.data;
  },

  createSupplier: async (storeId: string, data: SupplierCreateData): Promise<Supplier> => {
    const response = await coreApiClient.post<Supplier>(`/transactions/stores/${storeId}/suppliers/`, data);
    return response.data;
  },

  updateSupplier: async (storeId: string, id: string, data: SupplierUpdateData): Promise<Supplier> => {
    const response = await coreApiClient.put<Supplier>(`/transactions/stores/${storeId}/suppliers/${id}/`, data);
    return response.data;
  },

  deleteSupplier: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/suppliers/${id}/`);
  },
};
