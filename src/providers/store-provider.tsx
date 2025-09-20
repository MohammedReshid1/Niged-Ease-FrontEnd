'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth, Store } from '@/providers/auth-provider';
import tokenStorage from '@/utils/token-storage';
import { enqueueSnackbar } from 'notistack';

// Custom event for store selection change
export const STORE_CHANGED_EVENT = 'store-selection-changed';

interface StoreContextType {
  currentStore: Store | null;
  stores: Store[];
  isLoading: boolean;
  selectStore: (store: Store) => void;
  refreshStores: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole, stores: authStores } = useAuth();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize store state from auth context and localStorage
  useEffect(() => {
    const initializeStores = () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Initializing stores:', { authStores });
        // Get stores from auth context or localStorage
        const availableStores = authStores.length > 0
          ? authStores
          : tokenStorage.getCompanyStores();
        
        console.log('Available stores:', availableStores);
        setStores(availableStores);

        // Get assigned store from localStorage
        const savedStore = tokenStorage.getAssignedStore();
        console.log('Saved store from token storage:', savedStore);
        
        if (savedStore) {
          // Verify the saved store exists in available stores
          const storeExists = availableStores.some(store => store.id === savedStore.id);
          console.log('Store exists in available stores:', storeExists);
          
          if (storeExists) {
            console.log('Setting current store to saved store:', savedStore);
            setCurrentStore(savedStore);
          } else if (availableStores.length > 0) {
            // If saved store doesn't exist anymore, select first available store
            console.log('Saved store not found in available stores, using first available store:', availableStores[0]);
            setCurrentStore(availableStores[0]);
            tokenStorage.saveAssignedStore(availableStores[0]);
          }
        } else if (availableStores.length > 0) {
          // No saved store, select first available
          console.log('No saved store found, using first available store:', availableStores[0]);
          setCurrentStore(availableStores[0]);
          tokenStorage.saveAssignedStore(availableStores[0]);
        } else {
          console.warn('No stores available for the user');
        }
      } catch (error) {
        console.error('Error initializing stores:', error);
        enqueueSnackbar('Failed to load store information', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStores();
  }, [isAuthenticated, authStores]);

  // Handle store selection
  const handleSelectStore = (store: Store) => {
    if (store.id !== currentStore?.id) {
      setCurrentStore(store);
      tokenStorage.saveAssignedStore(store);
      
      // Dispatch a custom event to notify components that the store has changed
      if (typeof window !== 'undefined') {
        const event = new CustomEvent(STORE_CHANGED_EVENT, { 
          detail: { storeId: store.id, storeName: store.name } 
        });
        window.dispatchEvent(event);
      }

      // Show notification
      enqueueSnackbar(`Switched to store: ${store.name}`, { 
        variant: 'success',
        autoHideDuration: 3000
      });
    }
  };

  // Force refresh stores from auth context
  const handleRefreshStores = () => {
    setIsLoading(true);
    try {
      const availableStores = authStores.length > 0
        ? authStores
        : tokenStorage.getCompanyStores();
      
      setStores(availableStores);

      // If current store is no longer available, select first available store
      if (currentStore && !availableStores.some(store => store.id === currentStore.id)) {
        if (availableStores.length > 0) {
          setCurrentStore(availableStores[0]);
          tokenStorage.saveAssignedStore(availableStores[0]);
        } else {
          setCurrentStore(null);
        }
      }
    } catch (error) {
      console.error('Error refreshing stores:', error);
      enqueueSnackbar('Failed to refresh store information', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      currentStore,
      stores,
      isLoading,
      selectStore: handleSelectStore,
      refreshStores: handleRefreshStores,
    }),
    [currentStore, stores, isLoading]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  
  return context;
}; 