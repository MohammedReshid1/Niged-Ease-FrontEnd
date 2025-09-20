import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';

// Create an axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://evergreen-technologies-ngedease-coreservice.147.79.115.12.sslip.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests if token exists
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic API request function
export const fetchApi = async <T,>(
  endpoint: string,
  options?: any
): Promise<T> => {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...options
    });
    return response.data as T;
  } catch (error: any) {
    // Handle API errors
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
      }
    }
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

// TanStack Query hook for fetching data
export function useApiQuery<T>(
  queryKey: string | string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'>
) {
  const formattedQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery<T, Error, T, string[]>({
    queryKey: formattedQueryKey,
    queryFn: () => fetchApi<T>(endpoint),
    ...options,
  });
}

// TanStack Query hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, V>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T, Error, V>({
    mutationFn: (data: V) => 
      fetchApi<T>(endpoint, { 
        method, 
        data: method !== 'DELETE' ? data : undefined,
        params: method === 'DELETE' ? data : undefined
      }),
    onSuccess: (data, variables, context) => {
      // Optionally invalidate queries when mutation is successful
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
} 