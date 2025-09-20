import { useApiQuery, useApiMutation } from '@/utils/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

// Get all products with pagination and filters
export function useProducts(params: ProductParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/products?${queryParams.toString()}`;
  
  return useApiQuery<ProductsResponse>(
    ['products', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single product by ID
export function useProduct(id: string) {
  return useApiQuery<Product>(
    ['product', id], 
    `/products/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new product
export function useCreateProduct() {
  return useApiMutation<Product, ProductInput>(
    '/products',
    'POST',
    {
      onSuccess: (data) => {
        console.log('Product created successfully', data);
      },
    }
  );
}

// Update an existing product
export function useUpdateProduct(id: string) {
  return useApiMutation<Product, Partial<ProductInput>>(
    `/products/${id}`,
    'PATCH',
    {
      onSuccess: (data) => {
        console.log('Product updated successfully', data);
      },
    }
  );
}

// Delete a product
export function useDeleteProduct() {
  return useApiMutation<void, string>(
    '/products',
    'DELETE',
    {
      onSuccess: () => {
        console.log('Product deleted successfully');
      },
    }
  );
} 