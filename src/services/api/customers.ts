import { Company } from './companies';

export interface Customer {
  id: string;
  company: Company;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateData {
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  notes?: string;
}

export interface CustomerUpdateData extends Partial<CustomerCreateData> {} 