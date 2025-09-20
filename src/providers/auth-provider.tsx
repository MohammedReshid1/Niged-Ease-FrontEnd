'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { paths } from '@/paths';
import { authApi } from '@/services/api/auth';
import tokenStorage from '@/utils/token-storage';

// Types
export type Store = {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: string;
};

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  userRole: string | null;
  userInfo: any;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string, stores?: Store[], assignedStore?: Store) => Promise<void>;
  logout: () => void;
  stores: Store[];
  assignedStore: Store | null;
  saveEmail: (email: string) => void;
  refreshUserInfo: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [assignedStore, setAssignedStore] = useState<Store | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        const role = tokenStorage.getUserRole();
        const companyId = tokenStorage.getCompanyId();
        
        if (accessToken) {
          try {
            // Verify token with backend
            const tokenInfo = await authApi.verifyToken(accessToken);
            if (tokenInfo.is_valid) {
              setIsAuthenticated(true);
              setUserRole(role);
              
              // Set basic user info
              const basicUserInfo = {
                id: tokenInfo.user_id,
                email: tokenInfo.email,
                role: role,
                company_id: companyId || tokenInfo.company_id,
              };
              
              // Try to get full user profile with profile_image
              try {
                const userProfile = await authApi.getProfile();
                setUserInfo({
                  ...basicUserInfo,
                  first_name: userProfile.first_name,
                  last_name: userProfile.last_name,
                  profile_image: userProfile.profile_image,
                  company_id: userProfile.company_id || basicUserInfo.company_id,
                });
              } catch (profileError) {
                console.error('Error fetching full profile:', profileError);
                // Fall back to basic user info
                setUserInfo(basicUserInfo);
              }
              
              // Load stores from storage
              const storedStores = tokenStorage.getCompanyStores();
              if (storedStores && storedStores.length > 0) {
                setStores(storedStores);
              }
              
              // Load assigned store for non-admin users
              const storedAssignedStore = tokenStorage.getAssignedStore();
              if (storedAssignedStore) {
                setAssignedStore(storedAssignedStore);
              }
            } else {
              // Token is invalid
              handleLogout();
            }
          } catch (error) {
            console.error('Error verifying token:', error);
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Check if user should be redirected based on role & path
  useEffect(() => {
    if (isInitialized && !isLoading) {
      const isAuthRoute = pathname?.includes('/auth');
      const isPublicRoute = pathname === '/' || pathname === '/features' || pathname === '/contact';
      
      // Redirect to login if not authenticated and not on public pages
      if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
        router.push(paths.auth.signIn);
      }
      
      // Redirect to dashboard if authenticated but on login page
      if (isAuthenticated && isAuthRoute) {
        if (userRole === 'super_admin') {
          router.push(paths.superAdmin.dashboard);
        } else if (userRole === 'admin') {
          router.push(paths.admin.dashboard);
        } else if (userRole === 'stock_manager') {
          router.push(paths.stockManager.dashboard);
        } else if (userRole === 'sales') {
          router.push(paths.salesman.dashboard);
        } else {
          // Default fallback
          router.push(paths.admin.dashboard);
        }
      }
    }
  }, [isAuthenticated, isInitialized, isLoading, pathname, router, userRole]);

  // Login function - Step 1: Email/Password
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - Step 2: Verify OTP
  const handleVerifyOtp = async (email: string, otp: string, stores?: Store[], assignedStore?: Store) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      const { access, refresh, role, company_id, stores: responseStores } = response;
      
      console.log('OTP verification response:', response);
      
      // Process stores data - handle both array and single object formats
      let processedStores: Store[] = [];
      
      if (responseStores) {
        // Check if stores is an array (admin) or a single object (stock_manager/sales)
        if (Array.isArray(responseStores)) {
          processedStores = responseStores;
        } else {
          // For stock_manager and sales, stores is a single object
          processedStores = [responseStores];
        }
        console.log('Processed stores:', processedStores);
      } else if (stores && stores.length > 0) {
        processedStores = stores;
      }
      
      // Store tokens
      tokenStorage.saveTokens(
        access, 
        refresh, 
        role,
        company_id,
        assignedStore || response.assigned_store, 
        processedStores
      );
      
      // Update state
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Set user info
      setUserInfo({
        id: tokenStorage.getUserId(),
        email: email,
        role: role,
        company_id: company_id,
      });
      
      // Set stores and assigned store - prioritize API response
      if (processedStores.length > 0) {
        setStores(processedStores);
        
        // For stock_manager and sales, always use the first store as assigned store
        if ((role === 'stock_manager' || role === 'sales') && processedStores.length > 0) {
          setAssignedStore(processedStores[0]);
          tokenStorage.saveAssignedStore(processedStores[0]);
          console.log('Setting assigned store for stock_manager/sales:', processedStores[0]);
        }
        // For admin users with multiple stores, set the first store as default if not already assigned
        else if (role === 'admin' && !response.assigned_store && !assignedStore && processedStores.length > 0) {
          setAssignedStore(processedStores[0]);
          tokenStorage.saveAssignedStore(processedStores[0]);
        }
      }
      
      if (response.assigned_store || assignedStore) {
        setAssignedStore(response.assigned_store || assignedStore);
      }
      
      // Redirect based on role
      if (role === 'super_admin') {
        router.push(paths.superAdmin.dashboard);
      } else if (role === 'admin') {
        router.push(paths.admin.dashboard);
      } else if (role === 'stock_manager') {
        router.push(paths.stockManager.dashboard);
      } else if (role === 'sales') {
        router.push(paths.salesman.dashboard);
      } else {
        // Default fallback
        router.push(paths.admin.dashboard);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear tokens
    tokenStorage.clearTokens();
    
    // Reset state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserInfo(null);
    setStores([]);
    setAssignedStore(null);
    
    // Redirect to login
    router.push(paths.auth.signIn);
  };

  // Save email function for OTP flow
  const handleSaveEmail = (email: string) => {
    tokenStorage.saveEmail(email);
  };

  // Function to refresh user info from the API
  const refreshUserInfo = async () => {
    try {
      const userProfile = await authApi.getProfile();
      const basicUserInfo = {
        id: userInfo?.id,
        email: userInfo?.email,
        role: userRole,
        company_id: userInfo?.company_id,
      };
      
      setUserInfo({
        ...basicUserInfo,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        profile_image: userProfile.profile_image,
      });
    } catch (error) {
      console.error('Error refreshing user info:', error);
    }
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isInitialized,
      isLoading,
      userRole,
      userInfo,
      login: handleLogin,
      verifyOtp: handleVerifyOtp,
      logout: handleLogout,
      stores,
      assignedStore,
      saveEmail: handleSaveEmail,
      refreshUserInfo
    }),
    [
      isAuthenticated,
      isInitialized,
      isLoading,
      userRole,
      userInfo,
      stores,
      assignedStore
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 