import { useState, useEffect, useCallback } from 'react';
import { useAuth as useBaseAuth } from '@/providers/auth-provider';
import { authApi } from '@/services/api/auth';

export interface UserInfo {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id: string;
  role: string;
  profile_image?: string;
}

export function useAuth() {
  return useBaseAuth();
}

export function useCurrentUser() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useBaseAuth();

  const fetchUserInfo = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated, skipping profile fetch");
      setIsLoading(false);
      return null;
    }

    try {
      console.log("Fetching user profile...");
      setIsLoading(true);
      const userData = await authApi.getProfile();
      console.log("User profile received:", userData);
      
      // Force cast to UserInfo to avoid TS errors
      const typedUserData = userData as unknown as UserInfo;
      setUserInfo(typedUserData);
      console.log("UserInfo set:", userData);
      return typedUserData;
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      
      if (err.response) {
        console.error("API response error:", err.response.status, err.response.data);
      }
      
      setError(err as Error);
      console.log("Error set in useCurrentUser");
      return null;
    } finally {
      setIsLoading(false);
      console.log("Loading finished in useCurrentUser");
    }
  }, [isAuthenticated]);

  // Function to refresh user data and return the updated data
  const refreshUserData = useCallback(async (): Promise<UserInfo | null> => {
    return await fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      if (isMounted) {
        await fetchUserInfo();
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchUserInfo]);

  return { userInfo, isLoading, error, refreshUserData };
} 