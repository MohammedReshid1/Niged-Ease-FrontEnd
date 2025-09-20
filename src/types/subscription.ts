export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features: any; // This can be typed more specifically if needed
  is_active: boolean;
  storage_limit_gb: number;
  max_products: number;
  max_stores: number;
  max_customers: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  company: string;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string;
  is_active: boolean;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionCheckResponse {
  current_users_count: number;
  max_customers: number;
  current_stores_count: number;
  max_stores: number;
  current_products_count: number;
  max_products: number;
  current_storage_usage_gb: number;
  storage_limit_gb: number;
  subscription_plan: SubscriptionPlan;
}

export interface SubscriptionPlanCreateData {
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features?: any;
  is_active?: boolean;
  storage_limit_gb?: number;
  max_products?: number;
  max_stores?: number;
  max_customers?: number;
}

export interface SubscriptionPlanUpdateData extends Partial<SubscriptionPlanCreateData> {} 