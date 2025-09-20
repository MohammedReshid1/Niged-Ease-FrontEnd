import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi, Currency } from '@/services/api/companies';

// Define cache keys
export const currencyKeys = {
  all: ['currencies'] as const,
  lists: () => [...currencyKeys.all, 'list'] as const,
  list: () => [...currencyKeys.lists()] as const,
  details: () => [...currencyKeys.all, 'detail'] as const,
  detail: (id: string) => [...currencyKeys.details(), id] as const,
};

// Get all currencies
export function useCurrencies() {
  return useQuery<Currency[]>({
    queryKey: currencyKeys.list(),
    queryFn: () => companiesApi.getCurrencies(),
  });
}

// Get a specific currency by ID
export function useCurrency(id: string | undefined) {
  return useQuery<Currency>({
    queryKey: currencyKeys.detail(id || ''),
    queryFn: () => id ? companiesApi.getCurrency(id) : Promise.resolve(null as any),
    enabled: !!id,
  });
} 