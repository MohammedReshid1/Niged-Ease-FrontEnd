# TanStack Query Implementation Guide

This project uses TanStack Query (formerly React Query) for data fetching, caching, and state management.

## Overview

TanStack Query provides a declarative, efficient, and powerful way to fetch, cache, and update data in a React application. It helps manage server state in your application by providing powerful tools for:

- Data fetching
- Caching
- Deduplication of requests
- Background updates
- Refetching strategies
- Pagination
- Mutations
- Error handling

## Project Setup

The TanStack Query setup consists of:

1. **QueryProvider** - A provider that wraps the application in `src/providers/query-provider.tsx`
2. **API Utilities** - Utility functions for API calls in `src/utils/api.ts`
3. **Role-Specific Hooks** - Custom hooks for different user roles:
   - Super Admin: User management hooks in `src/hooks/super-admin/use-users.ts`
   - Admin: Company management hooks in `src/hooks/admin/use-companies.ts`
   - Stock Manager: Inventory management hooks in `src/hooks/stock-manager/use-inventory.ts`
   - Salesman: Sales management hooks in `src/hooks/salesman/use-sales.ts`
   - Common: Dashboard hooks in `src/hooks/dashboard/use-dashboard.ts`
   - Products: Example product hooks in `src/hooks/use-products.ts`

## How to Use

### Basic Data Fetching

To fetch data using TanStack Query, use the appropriate hook based on the user's role:

```typescript
// For Super Admin
import { useUsers } from '@/hooks/super-admin/use-users';

// For Admin
import { useCompanies } from '@/hooks/admin/use-companies';

// For Stock Manager
import { useInventory } from '@/hooks/stock-manager/use-inventory';

// For Salesman
import { useOrders } from '@/hooks/salesman/use-sales';

// Common for all roles
import { useDashboardStats } from '@/hooks/dashboard/use-dashboard';
```

### Using in Components

In your component, use the custom hook:

```tsx
import { useUsers } from '@/hooks/super-admin/use-users';

function UsersList() {
  const { data, isLoading, isError, error } = useUsers({ 
    page: 1, 
    limit: 10, 
    role: 'admin' 
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Mutations (POST, PUT, DELETE)

For data mutations, use the appropriate mutation hook:

```typescript
import { useCreateUser } from '@/hooks/super-admin/use-users';

function AddUserForm() {
  const createUserMutation = useCreateUser();
  
  const handleSubmit = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: (newUser) => {
        // Handle success
        toast.success('User created successfully');
      },
      onError: (error) => {
        // Handle error
        toast.error(`Error: ${error.message}`);
      }
    });
  };
  
  return (
    // Form JSX
  );
}
```

## Role-Specific Hooks

### Super Admin Hooks

The Super Admin hooks (`src/hooks/super-admin/use-users.ts`) provide functionality for managing users:

- `useUsers()` - Get a list of users with filtering and pagination
- `useUser(id)` - Get a single user by ID
- `useCreateUser()` - Create a new user
- `useUpdateUser(id)` - Update an existing user
- `useDeleteUser()` - Delete a user
- `useToggleUserStatus(id)` - Activate or deactivate a user

### Admin Hooks

The Admin hooks (`src/hooks/admin/use-companies.ts`) provide functionality for managing companies:

- `useCompanies()` - Get a list of companies with filtering and pagination
- `useCompany(id)` - Get a single company by ID
- `useCreateCompany()` - Create a new company
- `useUpdateCompany(id)` - Update an existing company
- `useDeleteCompany()` - Delete a company
- `useToggleCompanyStatus(id)` - Activate or deactivate a company

### Stock Manager Hooks

The Stock Manager hooks (`src/hooks/stock-manager/use-inventory.ts`) provide functionality for managing inventory:

- `useInventory()` - Get a list of inventory items with filtering and pagination
- `useInventoryItem(id)` - Get a single inventory item by ID
- `useCreateInventoryItem()` - Create a new inventory item
- `useUpdateInventoryItem(id)` - Update an existing inventory item
- `useDeleteInventoryItem()` - Delete an inventory item
- `useAdjustInventory(id)` - Adjust inventory quantities
- `useInventoryStats()` - Get inventory statistics

### Salesman Hooks

The Salesman hooks (`src/hooks/salesman/use-sales.ts`) provide functionality for managing sales:

- `useOrders()` - Get a list of orders with filtering and pagination
- `useOrder(id)` - Get a single order by ID
- `useCreateOrder()` - Create a new order
- `useUpdateOrderStatus(id)` - Update an order's status
- `useUpdatePaymentStatus(id)` - Update an order's payment status
- `useCancelOrder(id)` - Cancel an order
- `useCustomers()` - Get a list of customers
- `useCustomer(id)` - Get a single customer by ID
- `useCreateCustomer()` - Create a new customer
- `useSalesStats(period)` - Get sales statistics

### Dashboard Hooks

The Dashboard hooks (`src/hooks/dashboard/use-dashboard.ts`) provide common functionality for all roles:

- `useDashboardStats(period)` - Get dashboard statistics
- `useRecentActivity(limit)` - Get recent activity
- `useNotifications()` - Get system notifications
- `useUserDashboardInfo()` - Get user-specific dashboard information

## DevTools

TanStack Query DevTools are available in development mode. Access them by:

1. Look for the floating TanStack Query logo in the bottom-right corner of your application
2. Click on it to expand the DevTools panel
3. Use it to inspect queries, their states, and data

## Best Practices

1. **Use Query Keys Consistently**: Structure query keys to represent the data they fetch.
2. **Cache Invalidation**: Invalidate queries after mutations to keep data fresh.
3. **Pagination and Infinite Queries**: For lists, use pagination or infinite query features.
4. **Error Handling**: Implement proper error handling in components.
5. **Prefetching**: Prefetch data for anticipated routes or actions.

## Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [API Utilities in this Project](src/utils/api.ts)
- [Example Product Hooks](src/hooks/use-products.ts)
- [Example Product List Component](src/components/products/product-list.tsx) 