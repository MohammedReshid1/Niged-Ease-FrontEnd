import { useQuery, useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { companiesApi } from '@/services/api/companies';
import { inventoryApi } from '@/services/api/inventory';
import { usersApi } from '@/services/api/users';

export interface CompanyFormState {
  step: number;
  companyData: {
    name: string;
    short_name: string;
    address: string;
    description: string;
    subscription_plan_id: string;
    currency_id: string;
  };
  storeData: {
    name: string;
    address: string;
    phone_number: string;
    email: string;
    location: string;
    is_active: "active" | "inactive";
  };
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    profile_image: string;
  };
}

const initialFormState: CompanyFormState = {
  step: 0,
  companyData: {
    name: '',
    short_name: '',
    address: '',
    description: '',
    subscription_plan_id: '',
    currency_id: ''
  },
  storeData: {
    name: '',
    address: '',
    phone_number: '',
    email: '',
    location: '',
    is_active: "active"
  },
  userData: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    profile_image: ''
  }
};

export function useCompanyForm() {
  const [formState, setFormState] = useState<CompanyFormState>(initialFormState);
  
  // Fetch required data for the form
  const results = useQueries({
    queries: [
      {
        queryKey: ['subscription-plans'],
        queryFn: () => companiesApi.getSubscriptionPlans(),
      },
      {
        queryKey: ['currencies'],
        queryFn: () => companiesApi.getCurrencies(),
      }
    ]
  });
  
  const [subscriptionPlansResult, currenciesResult] = results;
  
  const isLoading = subscriptionPlansResult.isLoading || currenciesResult.isLoading;
  const isError = subscriptionPlansResult.isError || currenciesResult.isError;
  
  // Update form state handlers
  const updateCompanyData = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      companyData: {
        ...prev.companyData,
        [field]: value
      }
    }));
  };
  
  const updateStoreData = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      storeData: {
        ...prev.storeData,
        [field]: value
      }
    }));
  };
  
  const updateUserData = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        [field]: value
      }
    }));
  };
  
  const nextStep = () => {
    setFormState(prev => ({
      ...prev,
      step: prev.step + 1
    }));
  };
  
  const prevStep = () => {
    setFormState(prev => ({
      ...prev,
      step: Math.max(0, prev.step - 1)
    }));
  };
  
  return {
    formState,
    isLoading,
    isError,
    subscriptionPlans: subscriptionPlansResult.data || [],
    currencies: currenciesResult.data || [],
    updateCompanyData,
    updateStoreData,
    updateUserData,
    nextStep,
    prevStep,
    resetForm: () => setFormState(initialFormState)
  };
} 