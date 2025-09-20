import { useApiQuery } from '@/utils/api';

export interface DashboardStats {
  revenue: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  orders: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  customers: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  products: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product' | 'inventory' | 'payment';
  action: string;
  entityId: string;
  entityName: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

// Get dashboard statistics
export function useDashboardStats(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly') {
  return useApiQuery<DashboardStats>(
    ['dashboard-stats', period], 
    `/dashboard/stats?period=${period}`
  );
}

// Get recent activity
export function useRecentActivity(limit: number = 10) {
  return useApiQuery<RecentActivity[]>(
    ['recent-activity', limit.toString()], 
    `/dashboard/activity?limit=${limit}`
  );
}

// Get system notifications
export function useNotifications() {
  return useApiQuery<{
    total: number;
    unread: number;
    notifications: {
      id: string;
      title: string;
      message: string;
      type: 'info' | 'warning' | 'success' | 'error';
      read: boolean;
      timestamp: string;
    }[];
  }>(
    ['notifications'], 
    '/notifications'
  );
}

// Get user-specific dashboard info
export function useUserDashboardInfo() {
  return useApiQuery<{
    tasks: { total: number; completed: number; pending: number };
    messages: { total: number; unread: number };
    performance: { target: number; achieved: number; percentage: number };
  }>(
    ['user-dashboard'], 
    '/dashboard/user-info'
  );
} 