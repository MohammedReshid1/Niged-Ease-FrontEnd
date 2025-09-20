import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Company, 
  CompanyCreateData, 
  CompanyUpdateData, 
  Currency, 
  CurrencyCreateData,
  CurrencyUpdateData,
  SubscriptionPlan, 
  SubscriptionCheckResponse,
  companiesApi 
} from '@/services/api/companies';

// Query keys
export const companiesKeys = {
  all: ['companies'] as const,
  lists: () => [...companiesKeys.all, 'list'] as const,
  list: (filters: string) => [...companiesKeys.lists(), { filters }] as const,
  details: () => [...companiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const,
  
  currencies: {
    all: ['currencies'] as const,
    lists: () => [...companiesKeys.currencies.all, 'list'] as const,
    list: (filters: string) => [...companiesKeys.currencies.lists(), { filters }] as const,
    details: () => [...companiesKeys.currencies.all, 'detail'] as const,
    detail: (id: string) => [...companiesKeys.currencies.details(), id] as const,
  },
  
  subscriptionPlans: {
    all: ['subscription-plans'] as const,
    lists: () => [...companiesKeys.subscriptionPlans.all, 'list'] as const,
    list: (filters: string) => [...companiesKeys.subscriptionPlans.lists(), { filters }] as const,
    details: () => [...companiesKeys.subscriptionPlans.all, 'detail'] as const,
    detail: (id: string) => [...companiesKeys.subscriptionPlans.details(), id] as const,
  },
};

// Companies hooks
export function useCompanies() {
  return useQuery({
    queryKey: companiesKeys.lists(),
    queryFn: () => companiesApi.getCompanies(),
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: companiesKeys.detail(id),
    queryFn: () => companiesApi.getCompany(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CompanyCreateData) => companiesApi.createCompany(data),
    onSuccess: () => {
      // Invalidate the companies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyUpdateData }) => companiesApi.updateCompany(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific company
      queryClient.setQueryData(companiesKeys.detail(data.id), data);
      // Invalidate the companies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCompany(id),
    onSuccess: () => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
    }
  });
}

// Currencies hooks
export function useCurrencies() {
  return useQuery({
    queryKey: companiesKeys.currencies.lists(),
    queryFn: () => companiesApi.getCurrencies(),
  });
}

export function useCurrency(id: string) {
  return useQuery({
    queryKey: companiesKeys.currencies.detail(id),
    queryFn: () => companiesApi.getCurrency(id),
    enabled: !!id,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CurrencyCreateData) => companiesApi.createCurrency(data),
    onSuccess: () => {
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CurrencyUpdateData }) => companiesApi.updateCurrency(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific currency
      queryClient.setQueryData(companiesKeys.currencies.detail(data.id), data);
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCurrency(id),
    onSuccess: () => {
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

// Subscription Plans hooks
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: companiesKeys.subscriptionPlans.lists(),
    queryFn: () => companiesApi.getSubscriptionPlans(),
  });
}

export function useSubscriptionPlan(id: string) {
  return useQuery({
    queryKey: companiesKeys.subscriptionPlans.detail(id),
    queryFn: () => companiesApi.getSubscriptionPlan(id),
    enabled: !!id,
  });
}

export interface SubscriptionPlanData {
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features: string;
  is_active: boolean;
  storage_limit_gb: number;
  max_products: number;
  max_stores: number;
  max_customers: number;
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SubscriptionPlanData) => companiesApi.createSubscriptionPlan(data),
    onSuccess: () => {
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionPlanData }) => companiesApi.updateSubscriptionPlan(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific subscription plan
      queryClient.setQueryData(companiesKeys.subscriptionPlans.detail(data.id), data);
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteSubscriptionPlan(id),
    onSuccess: () => {
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

// Hook to check company subscription details
export function useCheckCompanySubscription(companyId?: string) {
  return useQuery({
    queryKey: ['company-subscription', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID is required');
      return await companiesApi.checkCompanySubscription(companyId);
    },
    enabled: !!companyId
  });
} 