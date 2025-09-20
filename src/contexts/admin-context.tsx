'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Company {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  registerDate: string;
  users: number;
  subscriptionPlan: string;
  status?: 'active' | 'inactive' | 'expired';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  maxProducts: number;
  modules: string[];
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  position: string;
  code: string;
}

interface AdminContextType {
  // Companies
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  
  // Subscription Plans
  subscriptionPlans: SubscriptionPlan[];
  setSubscriptionPlans: React.Dispatch<React.SetStateAction<SubscriptionPlan[]>>;
  addSubscriptionPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  updateSubscriptionPlan: (id: string, plan: Partial<SubscriptionPlan>) => void;
  deleteSubscriptionPlan: (id: string) => void;
  
  // Currencies
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
  addCurrency: (currency: Omit<Currency, 'id'>) => void;
  updateCurrency: (id: string, currency: Partial<Currency>) => void;
  deleteCurrency: (id: string) => void;
  
  // Loading & Error states
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Companies state
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Ochoa and Cabrera Traders',
      email: 'ricasafa@mailinator.com',
      verified: false,
      registerDate: '29-04-2025',
      users: 1,
      subscriptionPlan: 'Trial (monthly)',
      status: 'active',
    },
    {
      id: '2',
      name: 'Cybercom Revolution',
      email: 'm.alnsour@cy-com.com',
      verified: false,
      registerDate: '29-04-2025',
      users: 1,
      subscriptionPlan: 'Trial (monthly)',
      status: 'active',
    },
    {
      id: '3',
      name: '123/124, Mansarovar Society, Sarthana Jakatnaka, Surat',
      email: 'sutariyarajan214@gmail.com',
      verified: false,
      registerDate: '29-04-2025',
      users: 1,
      subscriptionPlan: 'Trial (monthly)',
      status: 'active',
    },
    {
      id: '4',
      name: 'Stockify',
      email: 'company@example.com',
      verified: false,
      registerDate: '29-04-2025',
      users: 34,
      subscriptionPlan: 'Trial (monthly)',
      status: 'active',
    },
  ]);

  // Subscription Plans state
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'ddd',
      monthlyPrice: '$44.00',
      annualPrice: '$44.00',
      maxProducts: 44,
      modules: []
    },
    {
      id: '2',
      name: 'dd',
      monthlyPrice: '$33.00',
      annualPrice: '$33.00',
      maxProducts: 22222,
      modules: ['POS', 'Online Store']
    },
    {
      id: '3',
      name: 'Sales X',
      monthlyPrice: '$0.00',
      annualPrice: '$0.00',
      maxProducts: 99999,
      modules: [
        'POS', 
        'Online Store',
        'Purchase Return',
        'Reports Download',
        'Sales Return',
        'Expense',
        'Stock Transfer',
        'Stock Adjustment',
        'Quotation/Estimate',
        'Reports'
      ]
    },
    {
      id: '4',
      name: 'Sales Max',
      monthlyPrice: '$4,000.00',
      annualPrice: '$28,000.00',
      maxProducts: 50,
      modules: [
        'Purchase Return', 
        'Reports Download', 
        'POS', 
        'Online Store', 
        'Sales Return', 
        'Reports'
      ]
    },
  ]);

  // Currencies state
  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      id: '1',
      name: 'Rupee',
      symbol: '₹',
      position: 'front',
      code: 'INR',
    },
    {
      id: '2',
      name: 'Dollar',
      symbol: '$',
      position: 'front',
      code: 'USD',
    },
  ]);

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Companies CRUD
  const addCompany = (company: Omit<Company, 'id'>) => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate adding a company locally
      const newCompany = {
        ...company,
        id: Date.now().toString(),
        status: 'active' as const,
      };
      setCompanies((prev) => [...prev, newCompany]);
      setError(null);
    } catch (err) {
      setError('Failed to add company');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = (id: string, company: Partial<Company>) => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      setCompanies((prev) => 
        prev.map((c) => (c.id === id ? { ...c, ...company } : c))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update company');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = (id: string) => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete company');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Subscription Plans CRUD
  const addSubscriptionPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
    setLoading(true);
    try {
      const newPlan = {
        ...plan,
        id: Date.now().toString(),
      };
      setSubscriptionPlans((prev) => [...prev, newPlan]);
      setError(null);
    } catch (err) {
      setError('Failed to add subscription plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionPlan = (id: string, plan: Partial<SubscriptionPlan>) => {
    setLoading(true);
    try {
      setSubscriptionPlans((prev) => 
        prev.map((p) => (p.id === id ? { ...p, ...plan } : p))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update subscription plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriptionPlan = (id: string) => {
    setLoading(true);
    try {
      setSubscriptionPlans((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete subscription plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Currencies CRUD
  const addCurrency = (currency: Omit<Currency, 'id'>) => {
    setLoading(true);
    try {
      const newCurrency = {
        ...currency,
        id: Date.now().toString(),
      };
      setCurrencies((prev) => [...prev, newCurrency]);
      setError(null);
    } catch (err) {
      setError('Failed to add currency');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = (id: string, currency: Partial<Currency>) => {
    setLoading(true);
    try {
      setCurrencies((prev) => 
        prev.map((c) => (c.id === id ? { ...c, ...currency } : c))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update currency');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrency = (id: string) => {
    setLoading(true);
    try {
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete currency');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        companies,
        setCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
        subscriptionPlans,
        setSubscriptionPlans,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        currencies,
        setCurrencies,
        addCurrency,
        updateCurrency,
        deleteCurrency,
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 