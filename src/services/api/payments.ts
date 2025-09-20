import { apiCall } from '@/utils/api-call';

export interface PaymentIn {
  id: string;
  store_id: string;
  receivable?: string;
  sale?: string;
  amount: string;
  currency: string;
  payment_mode: {
    id: string;
    store_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaymentOut {
  id: string;
  store_id: string;
  payable?: string;
  purchase?: string;
  amount: string;
  currency: string;
  payment_mode: {
    id: string;
    store_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInData {
  store_id: string;
  receivable?: string;
  sale?: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export interface CreatePaymentOutData {
  store_id: string;
  payable?: string;
  purchase?: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

// Extended types with type property
export interface PaymentInWithType extends PaymentIn {
  type: 'in';
}

export interface PaymentOutWithType extends PaymentOut {
  type: 'out';
}

export type Payment = PaymentInWithType | PaymentOutWithType;

// Payments API service
export const paymentsApi = {
  // Get all payments for a store
  async getPayments(storeId: string): Promise<Payment[]> {
    try {
      const [paymentsIn, paymentsOut] = await Promise.all([
        this.getPaymentsIn(storeId),
        this.getPaymentsOut(storeId)
      ]);
      
      // Combine and mark payment types
      const combinedPayments = [
        ...paymentsIn.map(payment => ({ ...payment, type: 'in' as const })),
        ...paymentsOut.map(payment => ({ ...payment, type: 'out' as const }))
      ];
      
      return combinedPayments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  // Get all incoming payments for a store
  async getPaymentsIn(storeId: string): Promise<PaymentIn[]> {
    const response = await apiCall({
      method: 'GET',
      url: `/financials/stores/${storeId}/payments-in/`,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Get all outgoing payments for a store
  async getPaymentsOut(storeId: string): Promise<PaymentOut[]> {
    const response = await apiCall({
      method: 'GET',
      url: `/financials/stores/${storeId}/payments-out/`,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Get payment by ID
  async getPaymentInById(storeId: string, id: string): Promise<PaymentIn> {
    const response = await apiCall({
      method: 'GET',
      url: `/financials/stores/${storeId}/payments-in/${id}/`,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Get payment by ID
  async getPaymentOutById(storeId: string, id: string): Promise<PaymentOut> {
    const response = await apiCall({
      method: 'GET',
      url: `/financials/stores/${storeId}/payments-out/${id}/`,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Create a new incoming payment
  async createPaymentIn(paymentData: CreatePaymentInData): Promise<PaymentIn> {
    const response = await apiCall({
      method: 'POST',
      url: `/financials/stores/${paymentData.store_id}/payments-in/`,
      data: paymentData,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Create a new outgoing payment
  async createPaymentOut(paymentData: CreatePaymentOutData): Promise<PaymentOut> {
    const response = await apiCall({
      method: 'POST',
      url: `/financials/stores/${paymentData.store_id}/payments-out/`,
      data: paymentData,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Update an existing incoming payment
  async updatePaymentIn(storeId: string, id: string, paymentData: Partial<CreatePaymentInData>): Promise<PaymentIn> {
    const response = await apiCall({
      method: 'PUT',
      url: `/financials/stores/${storeId}/payments-in/${id}/`,
      data: paymentData,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Update an existing outgoing payment
  async updatePaymentOut(storeId: string, id: string, paymentData: Partial<CreatePaymentOutData>): Promise<PaymentOut> {
    const response = await apiCall({
      method: 'PUT',
      url: `/financials/stores/${storeId}/payments-out/${id}/`,
      data: paymentData,
      removeApiPrefix: true
    });
    return response.data;
  },

  // Delete an incoming payment
  async deletePaymentIn(storeId: string, id: string): Promise<void> {
    await apiCall({
      method: 'DELETE',
      url: `/financials/stores/${storeId}/payments-in/${id}/`,
      removeApiPrefix: true
    });
  },

  // Delete an outgoing payment
  async deletePaymentOut(storeId: string, id: string): Promise<void> {
    await apiCall({
      method: 'DELETE',
      url: `/financials/stores/${storeId}/payments-out/${id}/`,
      removeApiPrefix: true
    });
  },
}; 