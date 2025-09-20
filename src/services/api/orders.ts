import { Company } from './companies';
import { Customer } from './customers';
import { Product } from './inventory';
import { InventoryStore } from './inventory';

export interface OrderItem {
  id: string;
  order: Order;
  product: Product;
  quantity: string;
  unit_price: string;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemCreateData {
  product_id: string;
  quantity: string;
  unit_price: string;
}

export interface OrderItemUpdateData extends OrderItemCreateData {}

export interface Order {
  id: string;
  company: Company;
  store: InventoryStore;
  customer: Customer;
  order_number: string;
  order_date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderCreateData {
  company_id: string;
  store_id: string;
  customer_id: string;
  order_date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  notes?: string;
  items: OrderItemCreateData[];
}

export interface OrderUpdateData extends Partial<OrderCreateData> {} 