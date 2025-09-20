import axios from 'axios';
import tokenStorage from '@/utils/token-storage';
import { CORE_API } from '@/services/api/client';

// Create an axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${CORE_API}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests if token exists
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface for API call options
interface ApiCallOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  removeApiPrefix?: boolean; // Option to bypass the /api prefix
}

// API call function that returns data property from response
export const apiCall = async (options: ApiCallOptions) => {
  try {
    // If removeApiPrefix is true, use the CORE_API directly without /api
    const baseURL = options.removeApiPrefix 
      ? CORE_API 
      : (process.env.NEXT_PUBLIC_API_URL || `${CORE_API}/api`);
      
    const response = await axios.request({
      method: options.method,
      baseURL: baseURL,
      url: options.url,
      data: options.data,
      params: options.params,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...tokenStorage.getAccessToken() ? { 
          Authorization: `Bearer ${tokenStorage.getAccessToken()}` 
        } : {}
      },
    });
    return response;
  } catch (error: any) {
    // Handle API errors
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    }
    throw error;
  }
}; 