import { useQuery } from '@tanstack/react-query';
import { reportsApi, ReportData, ReportsResponse } from '@/services/api/reports';

export type ReportType = 'customer' | 'financial' | 'inventory' | 'product' | 'profit' | 'purchase' | 'revenue' | 'sales';

export interface ReportDateRange {
  startDate?: string;
  endDate?: string;
}

/**
 * Hook to fetch available report types for a store
 */
export function useAvailableReports(storeId: string | undefined) {
  return useQuery({
    queryKey: ['reports', 'available', storeId],
    queryFn: async (): Promise<ReportsResponse> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getAvailableReports(storeId);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific report for a store
 */
export function useReport(
  storeId: string | undefined, 
  reportType: ReportType | undefined,
  dateRange?: ReportDateRange
) {
  return useQuery({
    queryKey: ['reports', reportType, storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      if (!reportType) {
        throw new Error('Report type is required');
      }
      
      return await reportsApi.getReport(storeId, reportType, {
        start_date: dateRange?.startDate,
        end_date: dateRange?.endDate
      });
    },
    enabled: !!storeId && !!reportType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch customer report for a store
 */
export function useCustomerReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'customer', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getCustomerReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch financial report for a store
 */
export function useFinancialReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'financial', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getFinancialReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch inventory report for a store
 */
export function useInventoryReport(storeId: string | undefined) {
  return useQuery({
    queryKey: ['reports', 'inventory', storeId],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getInventoryReport(storeId);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch product report for a store
 */
export function useProductReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'product', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getProductReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch profit report for a store
 */
export function useProfitReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'profit', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getProfitReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch purchase report for a store
 */
export function usePurchaseReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'purchase', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getPurchaseReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch revenue report for a store
 */
export function useRevenueReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'revenue', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getRevenueReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch sales report for a store
 */
export function useSalesReport(storeId: string | undefined, dateRange?: ReportDateRange) {
  return useQuery({
    queryKey: ['reports', 'sales', storeId, dateRange?.startDate, dateRange?.endDate],
    queryFn: async (): Promise<ReportData> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      return await reportsApi.getSalesReport(storeId, dateRange?.startDate, dateRange?.endDate);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 