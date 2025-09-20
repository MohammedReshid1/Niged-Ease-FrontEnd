import { coreApiClient } from './client';
import { PaymentMode } from './transactions';

// Interfaces
export interface ExpenseCategory {
  id: string;
  store_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategoryCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ExpenseCategoryUpdateData extends ExpenseCategoryCreateData {}

export interface Expense {
  id: string;
  store_id: string;
  expense_category: string;
  amount: string;
  description: string;
  currency: string;
  payment_mode: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreateData {
  store_id: string;
  expense_category: string;
  amount: string;
  description: string;
  currency: string;
  payment_mode: string;
}

export interface ExpenseUpdateData extends ExpenseCreateData {}

export interface Payable {
  id: string;
  store_id: string;
  purchase: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface PayableCreateData {
  store_id: string;
  purchase: string;
  amount: string;
  currency: string;
}

export interface PayableUpdateData extends PayableCreateData {}

export interface PaymentIn {
  id: string;
  store_id: string;
  receivable: string;
  sale: string;
  amount: string;
  currency: string;
  payment_mode: PaymentMode;
  created_at: string;
  updated_at: string;
}

export interface PaymentInCreateData {
  store_id: string;
  receivable: string;
  sale: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export interface PaymentInUpdateData extends PaymentInCreateData {}

export interface PaymentOut {
  id: string;
  store_id: string;
  payable: string;
  purchase: string;
  amount: string;
  currency: string;
  payment_mode: PaymentMode;
  created_at: string;
  updated_at: string;
}

export interface PaymentOutCreateData {
  store_id: string;
  payable: string;
  purchase: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export interface PaymentOutUpdateData extends PaymentOutCreateData {}

export interface Receivable {
  id: string;
  store_id: string;
  sale: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ReceivableCreateData {
  store_id: string;
  sale: string;
  amount: string;
  currency: string;
}

export interface ReceivableUpdateData extends ReceivableCreateData {}

// API client
export const financialsApi = {
  // Expense Categories
  getExpenseCategories: async (storeId: string): Promise<ExpenseCategory[]> => {
    const response = await coreApiClient.get<ExpenseCategory[]>(`/financials/stores/${storeId}/expense-categories/`);
    return response.data;
  },

  getExpenseCategory: async (storeId: string, id: string): Promise<ExpenseCategory> => {
    const response = await coreApiClient.get<ExpenseCategory>(
      `/financials/stores/${storeId}/expense-categories/${id}/`
    );
    return response.data;
  },

  createExpenseCategory: async (storeId: string, data: ExpenseCategoryCreateData): Promise<ExpenseCategory> => {
    const response = await coreApiClient.post<ExpenseCategory>(
      `/financials/stores/${storeId}/expense-categories/`,
      data
    );
    return response.data;
  },

  updateExpenseCategory: async (
    storeId: string,
    id: string,
    data: ExpenseCategoryUpdateData
  ): Promise<ExpenseCategory> => {
    const response = await coreApiClient.put<ExpenseCategory>(
      `/financials/stores/${storeId}/expense-categories/${id}/`,
      data
    );
    return response.data;
  },

  deleteExpenseCategory: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/expense-categories/${id}/`);
  },

  // Expenses
  getExpenses: async (storeId: string, startDate?: string, endDate?: string): Promise<Expense[]> => {
    let url = `/financials/stores/${storeId}/expenses/`;

    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get<Expense[]>(url);
    return response.data;
  },

  getExpense: async (storeId: string, id: string): Promise<Expense> => {
    const response = await coreApiClient.get<Expense>(`/financials/stores/${storeId}/expenses/${id}/`);
    return response.data;
  },

  createExpense: async (storeId: string, data: ExpenseCreateData): Promise<Expense> => {
    const response = await coreApiClient.post<Expense>(`/financials/stores/${storeId}/expenses/`, data);
    return response.data;
  },

  updateExpense: async (storeId: string, id: string, data: ExpenseUpdateData): Promise<Expense> => {
    const response = await coreApiClient.put<Expense>(`/financials/stores/${storeId}/expenses/${id}/`, data);
    return response.data;
  },

  deleteExpense: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/expenses/${id}/`);
  },

  // Payables
  getPayables: async (storeId: string): Promise<Payable[]> => {
    const response = await coreApiClient.get<Payable[]>(`/financials/stores/${storeId}/payables/`);
    return response.data;
  },

  getPayable: async (storeId: string, id: string): Promise<Payable> => {
    const response = await coreApiClient.get<Payable>(`/financials/stores/${storeId}/payables/${id}/`);
    return response.data;
  },

  createPayable: async (storeId: string, data: PayableCreateData): Promise<Payable> => {
    const response = await coreApiClient.post<Payable>(`/financials/stores/${storeId}/payables/`, data);
    return response.data;
  },

  updatePayable: async (storeId: string, id: string, data: PayableUpdateData): Promise<Payable> => {
    const response = await coreApiClient.put<Payable>(`/financials/stores/${storeId}/payables/${id}/`, data);
    return response.data;
  },

  deletePayable: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/payables/${id}/`);
  },

  // Payments In
  getPaymentsIn: async (storeId: string): Promise<PaymentIn[]> => {
    const response = await coreApiClient.get<PaymentIn[]>(`/financials/stores/${storeId}/payments-in/`);
    return response.data;
  },

  getPaymentIn: async (storeId: string, id: string): Promise<PaymentIn> => {
    const response = await coreApiClient.get<PaymentIn>(`/financials/stores/${storeId}/payments-in/${id}/`);
    return response.data;
  },

  createPaymentIn: async (storeId: string, data: PaymentInCreateData): Promise<PaymentIn> => {
    const response = await coreApiClient.post<PaymentIn>(`/financials/stores/${storeId}/payments-in/`, data);
    return response.data;
  },

  updatePaymentIn: async (storeId: string, id: string, data: PaymentInUpdateData): Promise<PaymentIn> => {
    const response = await coreApiClient.put<PaymentIn>(`/financials/stores/${storeId}/payments-in/${id}/`, data);
    return response.data;
  },

  deletePaymentIn: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/payments-in/${id}/`);
  },

  // Payments Out
  getPaymentsOut: async (storeId: string): Promise<PaymentOut[]> => {
    const response = await coreApiClient.get<PaymentOut[]>(`/financials/stores/${storeId}/payments-out/`);
    return response.data;
  },

  getPaymentOut: async (storeId: string, id: string): Promise<PaymentOut> => {
    const response = await coreApiClient.get<PaymentOut>(`/financials/stores/${storeId}/payments-out/${id}/`);
    return response.data;
  },

  createPaymentOut: async (storeId: string, data: PaymentOutCreateData): Promise<PaymentOut> => {
    const response = await coreApiClient.post<PaymentOut>(`/financials/stores/${storeId}/payments-out/`, data);
    return response.data;
  },

  updatePaymentOut: async (storeId: string, id: string, data: PaymentOutUpdateData): Promise<PaymentOut> => {
    const response = await coreApiClient.put<PaymentOut>(`/financials/stores/${storeId}/payments-out/${id}/`, data);
    return response.data;
  },

  deletePaymentOut: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/payments-out/${id}/`);
  },

  // Receivables
  getReceivables: async (storeId: string): Promise<Receivable[]> => {
    const response = await coreApiClient.get<Receivable[]>(`/financials/stores/${storeId}/receivables/`);
    return response.data;
  },

  getReceivable: async (storeId: string, id: string): Promise<Receivable> => {
    const response = await coreApiClient.get<Receivable>(`/financials/stores/${storeId}/receivables/${id}/`);
    return response.data;
  },

  createReceivable: async (storeId: string, data: ReceivableCreateData): Promise<Receivable> => {
    const response = await coreApiClient.post<Receivable>(`/financials/stores/${storeId}/receivables/`, data);
    return response.data;
  },

  updateReceivable: async (storeId: string, id: string, data: ReceivableUpdateData): Promise<Receivable> => {
    const response = await coreApiClient.put<Receivable>(`/financials/stores/${storeId}/receivables/${id}/`, data);
    return response.data;
  },

  deleteReceivable: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/stores/${storeId}/receivables/${id}/`);
  },
};
