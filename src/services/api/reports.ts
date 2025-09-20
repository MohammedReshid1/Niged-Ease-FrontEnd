import { coreApiClient } from './client';

export interface ReportType {
  type: string;
  name: string;
  description: string;
  endpoint: string;
  supports_date_range: boolean;
}

export interface ReportData {
  title: string;
  description: string;
  store: string;
  date_range_start?: string;
  date_range_end?: string;
  [key: string]: any; // For report-specific fields
}

export interface ReportsResponse {
  store: string;
  store_name: string;
  available_reports: ReportType[];
}

export const reportsApi = {
  getAvailableReports: async (storeId: string): Promise<ReportsResponse> => {
    const response = await coreApiClient.get(`/reports/stores/${storeId}/reports/`);
    return response.data as ReportsResponse;
  },

  // Generic report fetching function
  getReport: async (
    storeId: string,
    reportType: string,
    filters?: {
      start_date?: string;
      end_date?: string;
      format?: 'table' | 'graph';
    }
  ): Promise<ReportData> => {
    // Map report types to their correct endpoint names
    const reportTypeMap: Record<string, string> = {
      'customer': 'customers',
      'financial': 'financials',
      'product': 'products',
      'purchase': 'purchases',
      'revenue': 'revenue',
      'profit': 'profit',
      'sales': 'sales',
      'inventory': 'inventory'
    };

    const endpointType = reportTypeMap[reportType] || reportType;
    let url = `/reports/stores/${storeId}/reports/${endpointType}/`;
    
    // Add query parameters if they exist
    if (filters?.start_date && filters?.end_date) {
      url += `?start_date=${filters.start_date}&end_date=${filters.end_date}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  // Specific endpoints for each report type
  getCustomerReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/customers/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getFinancialReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/financials/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getInventoryReport: async (
    storeId: string
  ): Promise<ReportData> => {
    const url = `/reports/stores/${storeId}/reports/inventory/`;
    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getProductReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/products/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getProfitReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/profit/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getPurchaseReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/purchases/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getRevenueReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/revenue/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  },

  getSalesReport: async (
    storeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ReportData> => {
    let url = `/reports/stores/${storeId}/reports/sales/`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await coreApiClient.get(url);
    return response.data as ReportData;
  }
}; 