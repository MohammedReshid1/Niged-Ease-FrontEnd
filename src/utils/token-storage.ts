// Constants for localStorage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const USER_EMAIL_KEY = 'niged_ease_user_email';
const USER_ID_KEY = 'niged_ease_user_id';
const ASSIGNED_STORE_KEY = 'assignedStore';
const COMPANY_STORES_KEY = 'companyStores';
const COMPANY_ID_KEY = 'companyId';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper to decode JWT token
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Utility functions for handling auth tokens in localStorage
 */
const tokenStorage = {
  // Get the stored access token
  getAccessToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get the stored refresh token
  getRefreshToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Get the stored user role
  getUserRole: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },

  // Get the stored company ID
  getCompanyId: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(COMPANY_ID_KEY);
  },

  // Get the assigned store
  getAssignedStore: (): any => {
    if (!isBrowser) return null;
    const store = localStorage.getItem(ASSIGNED_STORE_KEY);
    return store ? JSON.parse(store) : null;
  },

  // Get the company stores (for admin users)
  getCompanyStores: (): any[] => {
    const storesStr = localStorage.getItem(COMPANY_STORES_KEY);
    if (storesStr) {
      try {
        return JSON.parse(storesStr);
      } catch (e) {
        console.error('Failed to parse company stores', e);
        return [];
      }
    }
    return [];
  },

  // Save all tokens and role information
  saveTokens: (
    accessToken: string, 
    refreshToken: string, 
    role: string,
    companyId: string,
    assignedStore?: any,
    stores?: any[]
  ): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_ROLE_KEY, role);
    localStorage.setItem(COMPANY_ID_KEY, companyId);
    
    if (assignedStore) {
      localStorage.setItem(ASSIGNED_STORE_KEY, JSON.stringify(assignedStore));
    }
    
    if (stores && stores.length > 0) {
      localStorage.setItem(COMPANY_STORES_KEY, JSON.stringify(stores));
    }
    
    // Also extract and save user ID from access token
    const decoded = decodeToken(accessToken);
    if (decoded && decoded.user_id) {
      localStorage.setItem(USER_ID_KEY, decoded.user_id);
    }
  },

  // Save just the assigned store
  saveAssignedStore: (store: any): void => {
    localStorage.setItem(ASSIGNED_STORE_KEY, JSON.stringify(store));
  },

  // Save company stores
  saveCompanyStores: (stores: any[]): void => {
    localStorage.setItem(COMPANY_STORES_KEY, JSON.stringify(stores));
  },

  // Clear all stored tokens
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ASSIGNED_STORE_KEY);
    localStorage.removeItem(COMPANY_STORES_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
  },

  // Get user email
  getUserEmail: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_EMAIL_KEY);
  },

  // Get user ID
  getUserId: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_ID_KEY);
  },

  // Get user info from token
  getUserInfo: (): { id?: string; email?: string; role?: string; company_id?: string; store_id?: string } => {
    if (!isBrowser) return {};
    
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) return {};
    
    const decodedToken = decodeToken(accessToken);
    const email = localStorage.getItem(USER_EMAIL_KEY);
    const role = localStorage.getItem(USER_ROLE_KEY);
    const companyId = localStorage.getItem(COMPANY_ID_KEY);
    const storeId = localStorage.getItem('store_id'); // Try to get store_id
    
    return {
      id: decodedToken?.user_id || decodedToken?.sub || localStorage.getItem(USER_ID_KEY),
      email: email || decodedToken?.email,
      role: role || decodedToken?.role,
      company_id: companyId || decodedToken?.company_id,
      store_id: storeId || decodedToken?.store_id // Include store_id from token or localStorage
    };
  },

  // Save email temporarily (for OTP flow)
  saveEmail: (email: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(USER_EMAIL_KEY, email);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!isBrowser) return false;
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
};

export default tokenStorage; 