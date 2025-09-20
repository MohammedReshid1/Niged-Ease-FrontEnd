'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import tokenStorage from '@/utils/token-storage';

export type Store = {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: string;
};

export type StoreContextType = {
  stores: Store[];
  currentStore: Store | null;
  selectStore: (store: Store) => void;
  refreshStores: () => void;
  isLoading: boolean;
};

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Store provider component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStores = () => {
    setIsLoading(true);
    try {
      // Load stores from storage
      const storesFromStorage = tokenStorage.getCompanyStores();
      setStores(storesFromStorage);

      // Try to get last selected store from local storage
      const lastSelectedStoreJson = localStorage.getItem('lastSelectedStore');
      let lastSelectedStore = null;
      
      if (lastSelectedStoreJson) {
        try {
          lastSelectedStore = JSON.parse(lastSelectedStoreJson);
        } catch (e) {
          console.error('Failed to parse last selected store', e);
        }
      }

      // For non-admin roles, check if there's an assigned store
      const assignedStore = tokenStorage.getAssignedStore();
      
      if (assignedStore) {
        // If there's an assigned store, use it as the default
        setSelectedStore(assignedStore);
      } else if (lastSelectedStore && storesFromStorage.some(s => s.id === lastSelectedStore.id)) {
        // If there's a last selected store and it still exists, use it
        setSelectedStore(lastSelectedStore);
      } else if (storesFromStorage.length > 0) {
        // Otherwise, default to the first store
        setSelectedStore(storesFromStorage[0]);
        localStorage.setItem('lastSelectedStore', JSON.stringify(storesFromStorage[0]));
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const selectStore = (store: Store) => {
    setSelectedStore(store);
    localStorage.setItem('lastSelectedStore', JSON.stringify(store));
  };

  const refreshStores = () => {
    loadStores();
  };

  return (
    <StoreContext.Provider value={{ 
      stores, 
      currentStore, 
      selectStore, 
      refreshStores,
      isLoading 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store context
export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 