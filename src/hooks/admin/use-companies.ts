import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Company, CompanyCreateData, CompanyUpdateData } from '@/services/api/companies';

export interface CompaniesResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

export interface CompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all companies with pagination and filters
export function useCompanies(params: CompaniesParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/companies?${queryParams.toString()}`;
  
  return useApiQuery<CompaniesResponse>(
    ['companies', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single company by ID
export function useCompany(id: string) {
  return useApiQuery<Company>(
    ['company', id], 
    `/companies/${id}`,
    {
      enabled: !!id,
    }
  );
}

// Create a new company
export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Company, CompanyCreateData>(
    '/companies',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
}

// Update a company
export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Company, CompanyUpdateData>(
    `/companies/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company', id] });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
}

// Delete a company
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, { id: string }>(
    '/companies',
    'DELETE',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
}

// Get company statistics
export function useCompanyStats() {
  return useApiQuery<{
    total_companies: number;
    active_companies: number;
    inactive_companies: number;
    companies_by_subscription: { plan: string; count: number }[];
    companies_by_status: { status: string; count: number }[];
    recent_activities: {
      id: string;
      company_id: string;
      company_name: string;
      action: string;
      created_at: string;
    }[];
  }>(
    ['company-stats'], 
    '/companies/stats'
  );
} 